<template>
  <div>
    <!-- Card principal -->
    <q-card class="soft-card q-pa-lg q-mb-md">
      <div class="row items-start q-col-gutter-lg">
        <!-- Avatar + subir imagen -->
        <div class="col-12">
          <div class="row items-center q-gutter-md">
            <q-avatar size="110px" class="bg-grey-3">
              <q-img v-if="previewUrl" :src="previewUrl" :ratio="1" />
              <q-img v-else-if="avatarUrl" :src="avatarUrl" :ratio="1" />
              <q-icon v-else name="person" size="64px" class="text-grey-6" />
            </q-avatar>

            <div class="column">
              <q-btn
                color="deep-purple-5"
                unelevated
                no-caps
                dense
                class="q-px-lg q-py-xs"
                label="Subir Imagen"
                @click="pickFile"
                :loading="loading"
              />
              <div class="text-caption text-grey-7 q-mt-sm">
                Permitido JPG o PNG. Tamaño máximo 800K
              </div>

              <!-- File oculto -->
              <input
                ref="fileEl"
                type="file"
                accept="image/png,image/jpeg"
                class="hidden"
                @change="onFileChange"
              >
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="col-12 col-md-8">
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 q-mb-xs">Nombre</div>
                <q-input
                  dense outlined v-model="form.nombre" placeholder="john"
                  :rules="[v => !!v || 'Requerido']"
                />
              </div>

              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 q-mb-xs">Apellidos</div>
                <q-input dense outlined v-model="form.apellidos" placeholder="Doe" />
              </div>

              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 q-mb-xs">E-mail</div>
                <q-input
                  dense outlined v-model="form.email" type="email" placeholder="johnDoe@example.com"
                  :rules="[v => /.+@.+\..+/.test(v) || 'E-mail inválido']"
                />
              </div>

              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 q-mb-xs">Idioma</div>
                <q-select
                  dense outlined v-model="form.idioma"
                  :options="idiomas"
                  emit-value map-options
                />
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-md">
              <q-btn type="submit" color="deep-purple-5" unelevated label="Guardar" no-caps :loading="loading" />
              <q-btn flat color="grey-7" label="Cancelar" no-caps @click="onCancel" :loading="loading" />
            </div>
          </q-form>
        </div>
      </div>
    </q-card>

    <!-- Borrar cuenta -->
    <q-card class="soft-card q-pa-lg">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Borrar cuenta</div>

      <q-checkbox v-model="confirmDelete" dense>
        Confirmo que quiero eliminar la cuenta
      </q-checkbox>

      <div class="q-mt-md">
        <q-btn
          :loading="loading"
          color="negative"
          :disable="!confirmDelete"
          unelevated
          no-caps
          label="Eliminar Cuenta"
          @click="onDelete"
        />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'
import { useCounterStore } from 'stores/example-store'

const $q = useQuasar()
const { proxy } = getCurrentInstance()
const store = useCounterStore()
const loading = ref(false)

const fileEl = ref(null)
const previewUrl = ref(null)
const selectedFile = ref(null)

/* Prefill con datos del usuario en el store */
const form = ref({
  nombre: '',
  apellidos: '',
  email: '',
  idioma: 'es'
})

/* URL del avatar del backend:
   - si backend devuelve avatar_url, úsala
   - si solo devuelve avatar (ruta relativa), arma la URL con $url
*/
const avatarUrl = computed(() => {
  const u = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : store.user || {}
  if (u.avatar) return `${proxy.$url}/../images/${u.avatar}`
  return null
})

const idiomas = [
  { label: 'Español', value: 'Español' },
  { label: 'English', value: 'English' },
  { label: 'Português', value: 'Português' },
]

const confirmDelete = ref(false)

onMounted(() => {
  const u = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : store.user || {}
  form.value.nombre = u.name || u.nombre || ''
  form.value.apellidos = u.last_name || u.apellidos || ''
  form.value.email = u.email || ''
  form.value.idioma = u.language || u.idioma || 'es'
})

function pickFile () {
  fileEl.value?.click()
}

function onFileChange (e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 800 * 1024) {
    $q.notify({ type: 'warning', message: 'Máximo 800 KB' })
    e.target.value = ''
    return
  }

  selectedFile.value = file

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

/* Enviar a Laravel (un solo endpoint /me que acepta multipart) */
async function onSubmit () {
  try {
    loading.value = true
    const fd = new FormData()
    // fd.append('_method', 'PUT') // por compatibilidad Laravel cuando usas POST
    fd.append('name', form.value.nombre)
    fd.append('last_name', form.value.apellidos)
    fd.append('email', form.value.email)
    fd.append('language', form.value.idioma)
    if (selectedFile.value) fd.append('avatar', selectedFile.value)

    const { data } = await proxy.$axios.post('me', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // Actualiza store y localStorage con lo que devuelva el backend
    store.user = data
    localStorage.setItem('user', JSON.stringify(data))
    // refresca preview si te devuelven la nueva URL
    // if (data.avatar_url) {
    //   if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    //   previewUrl.value = data.avatar_url
    // }
    proxy.$alert.success('Datos actualizados correctamente')
    loading.value = false
  } catch (err) {
    console.error(err)
    loading.value = false
    proxy.$alert.error(err.response?.data?.message || 'Error al actualizar datos')
  }
}

function onCancel () {
  const u = store.user || {}
  form.value.nombre = u.name || u.nombre || ''
  form.value.apellidos = u.last_name || u.apellidos || ''
  form.value.email = u.email || ''
  form.value.idioma = u.language || u.idioma || 'es'
  // resetea preview si cancelas
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
    selectedFile.value = null
  }
  // $q.notify({ type: 'info', message: 'Cambios cancelados' })
  proxy.$alert.info('Cambios cancelados')
}

function onDelete () {
  $q.dialog({
    title: 'Eliminar cuenta',
    message: 'Esta acción es irreversible. ¿Deseas continuar?',
    ok: { label: 'Sí, eliminar', color: 'negative' },
    cancel: { label: 'Cancelar', flat: true }
  }).onOk(async () => {
    try {
      await proxy.$axios.delete('me')
      $q.notify({ type: 'negative', message: 'Cuenta eliminada (demo)' })
    } catch (e) {
      $q.notify({ type: 'negative', message: 'No se pudo eliminar' })
    }
  })
}
</script>

<style scoped>
.soft-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(17,16,62,.06);
}
.hidden { display: none; }
</style>
