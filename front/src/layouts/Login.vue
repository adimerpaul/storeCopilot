<template>
  <q-layout view="lHh Lpr lFf" class="bg-auth">
    <q-page-container>
      <q-page class="column items-center justify-center q-pa-md">
        <q-card class="auth-card soft-card q-pa-lg">
          <!-- Logo + marca -->
          <div class="column items-center q-mb-md">
            <div class="row items-center q-gutter-sm q-mb-md">
              <q-img src="logo.svg" width="40px" height="40px" class="rounded"/>

              <div class="text-h6 q-mt-sm">
                <span class="text-grey-8">Store</span><span class="text-weight-bold">Copilot</span>
              </div>
            </div>
          </div>

          <!-- Título -->
          <div class="text-h6 text-center q-mb-xs">¡Bienvenido! 👋</div>
          <div class="text-caption text-center text-grey-7 q-mb-lg">
            Por favor, inicia sesión en tu cuenta y comienza la aventura.
          </div>

          <!-- Form -->
          <q-form @submit.prevent="loginSubmit" greedy>
            <div class="q-mb-md">
              <div class="text-caption text-grey-7 q-mb-xs">Correo electrónico o nombre de usuario</div>
              <q-input
                v-model="login.email"
                outlined dense
                type="email"
                placeholder="admin@demo.com"
                :rules="[v => !!v || 'El correo es requerido']"
              />
            </div>

            <div class="q-mb-sm">
              <div class="text-caption text-grey-7 q-mb-xs">Contraseña</div>
              <q-input
                v-model="login.password"
                outlined dense
                :type="showPassword ? 'text' : 'password'"
                placeholder="************"
                :rules="[v => !!v || 'La contraseña es requerida']"
              >
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <div class="row items-center justify-between q-my-sm">
              <q-checkbox v-model="remember" dense label="Recuérdame" />
              <q-btn
                flat dense no-caps
                color="primary"
                label="¿Olvidaste tu contraseña?"
                @click="$router.push('/forgot')"
              />
            </div>

            <q-btn
              type="submit"
              color="deep-purple-5"
              unelevated
              no-caps
              class="full-width q-my-sm"
              :loading="loading"
              :disable="loading"
              label="Iniciar Sesión"
            />

            <div class="text-caption text-center text-grey-8 q-mt-sm">
              ¿Eres nuevo en nuestra plataforma?
              <q-btn flat no-caps dense color="primary" label="Crea una cuenta" @click="$router.push('/register')" />
            </div>

            <q-separator spaced />

            <div class="row items-center justify-center text-grey-6 q-mb-sm">o</div>

            <!-- Google -->
            <q-btn
              outline no-caps class="full-width"
              :href="googleUrl" type="a"
            >
              <template #default>
                <img :src="googleIcon" alt="Google" width="18" class="q-mr-sm">
                Continuar con Google
              </template>
            </q-btn>
          </q-form>
        </q-card>

        <div class="text-caption text-grey-6 q-mt-md">
          © {{ new Date().getFullYear() }}. Todos los derechos reservados.
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useCounterStore } from 'stores/example-store'

export default {
  name: 'Login',
  data () {
    return {
      login: {
        email: localStorage.getItem('remember_email') || 'adimer101@gmail.com',
        password: 'admin123Admin',
      },
      showPassword: false,
      loading: false,
      remember: !!localStorage.getItem('remember_email'),
      googleIcon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg', // ícono rápido
    }
  },
  computed: {
    googleUrl () {
      // adapta a tu backend Laravel (ruta de OAuth)
      return `${this.$url}/auth/google/redirect`
    }
  },
  methods: {
    async loginSubmit () {
      try {
        this.loading = true

        // --- LOGIN POR CORREO ---
        const { data } = await this.$axios.post('login', {
          email: this.login.email,          // <--- ahora es email
          password: this.login.password
        })

        // Guardar sesión
        this.$store.isLogged = true
        this.$store.user = data.user
        this.$axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
        localStorage.setItem('tokenEBA', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        useCounterStore().permissions = (data.user.permissions || []).map(p => p.name)

        // Remember email
        if (this.remember) localStorage.setItem('remember_email', this.login.email)
        else localStorage.removeItem('remember_email')

        this.$alert.success(`Bienvenido ${data.user.name || ''}`)
        this.$router.push('/')
      } catch (err) {
        this.$alert.error(err.response?.data?.message || 'Credenciales inválidas')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.bg-auth {
  background: #f6f5fb; /* gris muy claro como el mock */
}
.auth-card {
  width: 100%;
  max-width: 420px;       /* tarjeta compacta centrada */
}
.soft-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(17,16,62,.06);
}
</style>
