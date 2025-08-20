<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header class="bg-grey-1 text-dark">
      <q-toolbar class="q-px-md">
        <div class="row items-center q-gutter-sm">
          <!--          <q-avatar rounded size="28px" class="bg-primary text-white flex flex-center">-->
          <!--&lt;!&ndash;            <q-icon name="shopping_bag" size="18px" />&ndash;&gt;-->
          <!--          </q-avatar>-->
          <!--          <div class="text-subtitle1 text-weight-bold">StoreCopilot</div>-->
          <!--          <q-separator vertical spaced />-->
          <!--          <div class="text-caption text-grey-7">Cuenta</div>-->
          <q-btn
            flat round dense
            icon="menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
            class="q-mr-sm"/>
        </div>

        <q-space/>

        <!-- Acciones del header (iconografía simple como en el mock) -->
        <div class="row items-center q-gutter-sm">
          <q-btn flat round dense icon="translate"/>
          <q-btn flat round dense icon="brightness_low" @click="$q.dark.toggle()"/>
          <q-btn flat round dense icon="notifications_none">
            <q-badge color="red" floating></q-badge>
          </q-btn>
          <!--          <q-btn flat round dense icon="settings" />-->
          <q-btn flat dense>
            <div>
              <q-avatar>
                <q-img :src="`${$url}/../images/${$store.user.avatar}`" v-if="$store.user.avatar"/>
                <q-icon name="person" v-else/>
              </q-avatar>

              <q-menu>
                <q-list style="min-width: 180px">
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label class="text-grey-7">Permisos asignados</q-item-label>
                      <q-item-label caption>
                        <div class="row q-col-gutter-xs">
                          <q-chip
                            v-for="(p, i) in $store.permissions"
                            :key="i"
                            dense color="grey-3"
                            text-color="black"
                            size="12px"
                            class="q-mr-xs q-mb-xs"
                          >
                            {{ p }}
                          </q-chip>
                          <q-badge v-if="!$store.permissions?.length" color="grey-5" outline>Sin permisos</q-badge>
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator/>

                  <q-item clickable v-ripple @click="logout" v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="logout"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Salir</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-badge align="bottom" color="green"></q-badge>
            </div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER (claro, con grupos como en la captura) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="260"
      :breakpoint="900"
      bordered
      class="bg-white text-dark app-drawer"
    >
      <div class="q-pa-md q-pt-lg">
        <div class="row items-center q-gutter-sm q-mb-md">
          <q-img src="logo.svg" width="40px" height="40px" class="rounded"/>

          <div class="text-h6">
            Store<span class="text-weight-bold">Copilot</span>
          </div>
        </div>

        <q-separator class=""/>

        <!-- Secciones -->
        <q-list padding class="drawer-list">
          <template v-for="group in filteredGroups" :key="group.header">
            <q-item-label header class="drawer-header q-pa-xs" v-if="group.header!== 'OVERVIEW'">
              {{ group.header }}
            </q-item-label>

            <template v-for="item in group.items" :key="item.title">
              <q-item
                clickable v-ripple dense
                :to="item.link" exact
                class="drawer-item"
                active-class="drawer-item--active"
                v-close-popup
              >
                <q-item-section
                  avatar
                  class="drawer-avatar"
                >
                  <q-icon :name="item.icon" size="18px" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-body2">{{ item.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
          <!--              @click="logout"-->
          <q-item clickable dense class="drawer-item" v-close-popup @click="logout">
            <q-item-section avatar class="drawer-avatar">
              <q-icon name="logout" size="18px"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-body2">Salir</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="help_outline" />
            </q-item-section>
            <q-item-section>Learn</q-item-section>
          </q-item>

<!--          <div class="q-mt-lg q-pt-md">-->
<!--            <q-separator/>-->
<!--            <div class="q-mt-md text-caption text-grey-7">-->
<!--               v{{ $version }}<br>-->
<!--              © {{ new Date().getFullYear() }} Sistema de Gestión Apícola-->
<!--            </div>-->
<!--&lt;!&ndash;            <q-item clickable dense class="q-mt-sm text-negative" @click="logout" v-close-popup>&ndash;&gt;-->
<!--&lt;!&ndash;              <q-item-section avatar>&ndash;&gt;-->
<!--&lt;!&ndash;                <q-icon name="logout"/>&ndash;&gt;-->
<!--&lt;!&ndash;              </q-item-section>&ndash;&gt;-->
<!--&lt;!&ndash;              <q-item-section>&ndash;&gt;-->
<!--&lt;!&ndash;                <q-item-label>Salir</q-item-label>&ndash;&gt;-->
<!--&lt;!&ndash;              </q-item-section>&ndash;&gt;-->
<!--&lt;!&ndash;            </q-item>&ndash;&gt;-->
<!--          </div>-->
        </q-list>
      </div>
    </q-drawer>

    <!-- PAGE -->
    <q-page-container class="bg-grey-1">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed, getCurrentInstance, ref} from 'vue'
import {useCounterStore} from 'stores/example-store'

const {proxy} = getCurrentInstance()
const store = useCounterStore()

const leftDrawerOpen = ref(true)

/* ===== Helpers de permisos (manteniendo tu lógica) ===== */
function hasPerm(perm) {
  if (!perm) return true
  return store.permissions?.includes(perm)
}

function hasAnyPerm(perms = []) {
  return perms.some(p => hasPerm(p))
}

/* ===== Estructura de menú con grupos (similar a la imagen) ===== */
const menuGroups = [
  {
    header: 'OVERVIEW',
    items: [
      {title: 'Overview', icon: 'o_dashboard', link: '/', canPerm: 'Dashboard'}
    ]
  },
  {
    header: 'INFORMES',
    items: [
      {title: 'Rentabilidad y finanzas', icon: 'o_trending_up', link: '/finanzas', canPerm: ['Reportes', 'Dashboard']},
      {title: 'Ventas y conversión', icon: 'o_point_of_sale', link: '/ventas', canPerm: ['Reportes', 'Dashboard']},
      {
        title: 'Producto', icon: 'o_inventory_2', canPerm: 'Almacenamiento', subitems: [
          {title: 'Inventario', icon: 'o_inventory', link: '/inventario', canPerm: 'Almacenamiento'},
          {title: 'Productos', icon: 'o_inventory_2', link: '/productos', canPerm: 'Almacenamiento'},
          {title: 'Categorías', icon: 'o_category', link: '/categorias', canPerm: 'Almacenamiento'}
        ]
      },
      {
        title: 'Marketing', icon: 'o_auto_graph', canPerm: 'Reportes', subitems: [
          {title: 'Fuentes de tráfico', icon: 'o_auto_graph', link: '/trafico'},
          {title: 'Paid global', icon: 'o_paid', link: '/paid'},
          {title: 'Google Ads', icon: 'o_ads_click', link: '/google-ads'},
          {title: 'Meta Ads', icon: 'o_campaign', link: '/meta-ads'},
          {title: 'TikTok Ads', icon: 'o_smart_display', link: '/tiktok-ads'},
          {title: 'Klaviyo', icon: 'o_mark_email_unread', link: '/klaviyo'}
        ]
      },
      {
        title: 'Clientes y retención', icon: 'o_groups', canPerm: 'Usuarios', subitems: [
          {title: 'Clientes y fidelización', icon: 'o_groups', link: '/clientes'}
        ]
      },
      {
        title: 'Logística y operaciones', icon: 'o_local_shipping', canPerm: 'Despacho', subitems: [
          {title: 'Logística y operaciones', icon: 'o_local_shipping', link: '/logistica'}
        ]
      }
    ]
  },
  // {
  //   header: 'MARKETING',
  //   items: [
  //     { title: 'Fuentes de tráfico', icon: 'o_auto_graph', link: '/trafico', canPerm: 'Reportes' },
  //     { title: 'Paid global', icon: 'o_paid', link: '/paid', canPerm: 'Reportes' },
  //     { title: 'Google Ads', icon: 'o_ads_click', link: '/google-ads', canPerm: 'Reportes' },
  //     { title: 'Meta Ads', icon: 'o_campaign', link: '/meta-ads', canPerm: 'Reportes' },
  //     { title: 'TikTok Ads', icon: 'o_smart_display', link: '/tiktok-ads', canPerm: 'Reportes' },
  //     { title: 'Klaviyo', icon: 'o_mark_email_unread', link: '/klaviyo', canPerm: 'Reportes' }
  //   ]
  // },
  // {
  //   header: 'CLIENTES Y RETENCIÓN',
  //   items: [
  //     { title: 'Clientes y fidelización', icon: 'o_groups', link: '/clientes', canPerm: 'Usuarios' }
  //   ]
  // },
  // {
  //   header: 'LOGÍSTICA Y OPERACIONES',
  //   items: [
  //     { title: 'Logística y operaciones', icon: 'o_local_shipping', link: '/logistica', canPerm: 'Despacho' }
  //   ]
  // },
  {
    header: 'MANAGE',
    items: [
      {title: 'Configuración', icon: 'o_settings', link: '/configuraciones', canPerm: 'Configuracion'},
      {title: 'Reportar error o mejora', icon: 'o_bug_report', link: '/soporte', canPerm: 'Soporte'},
      // {title: 'Logout', icon: 'o_logout', link: '/logout', canPerm: null} // muestra botón abajo también
    ]
  }
]

/* Filtrado por permisos, respetando arrays o string único */
const filteredGroups = computed(() => {
  return menuGroups.map(g => ({
    header: g.header,
    items: g.items.filter(item => {
      if (Array.isArray(item.canPerm)) return hasAnyPerm(item.canPerm)
      if (item.canPerm) return hasPerm(item.canPerm)
      return true
    })
  })).filter(g => g.items.length > 0)
})

function logout() {
  proxy.$alert.dialog('¿Desea salir del sistema?')
    .onOk(() => {
      proxy.$axios.post('/logout')
        .then(() => {
          proxy.$store.isLogged = false
          proxy.$store.user = {}
          proxy.$store.permissions = []
          localStorage.removeItem('tokenEBA')
          proxy.$router.push('/login')
        })
        .catch(() => proxy.$alert.error('Error al cerrar sesión. Intente nuevamente.'))
    })
}

const roleText = computed(() => {
  const role = proxy.$store.user.role
  if (!role) return ''
  if (role === 'Administrador') return 'Administrador'
  return role
})
</script>

<style scoped>
/* Drawer look & feel similar to la referencia */
.app-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.drawer-header {
  font-size: 10px;
  letter-spacing: .12em;
  color: #9aa0a6;
}

.drawer-item {
  border-radius: 8px;
  padding: 6px 10px;
  margin: 2px 4px;
}

.drawer-item--active {
  background: #ebe7ff; /* tono lavanda claro */
  color: #5e35b1 !important; /* morado */
  font-weight: 600;
}

.drawer-item--active .q-icon {
  color: #5e35b1 !important;
}

.drawer-list .q-item__label {
  font-size: 13px;
}
.drawer-avatar {
  /* caja fija para el icono, centrado vertical y horizontal */
  width: 32px;                 /* ajusta a tu gusto: 28–36 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
