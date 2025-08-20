<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="container">
      <!-- Tabs en píldoras -->
      <q-tabs
        v-model="tab"
        class="q-mb-md tabs-soft"
        shrink
        no-caps
        active-color="white"
        indicator-color="transparent"
      >
        <q-tab name="cuenta"         class="tab-pill">Cuenta</q-tab>
        <q-tab name="acceso"         class="tab-pill">Acceso</q-tab>
        <q-tab name="usuarios"       class="tab-pill">Usuarios</q-tab>
        <q-tab name="notificaciones" class="tab-pill">Notificaciones</q-tab>
        <q-tab name="plan"           class="tab-pill">Plan y facturación</q-tab>
        <q-tab name="conexiones"     class="tab-pill">Conexiones</q-tab>
        <q-tab name="carga"          class="tab-pill">Carga de datos</q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade">
        <q-tab-panel name="cuenta" class="q-pa-none">
          <AccountTab />
        </q-tab-panel>

        <!-- Placeholders por ahora; los llenamos luego -->
        <q-tab-panel name="acceso"><div class="soft-card q-pa-lg">Acceso (pendiente)</div></q-tab-panel>
        <q-tab-panel name="usuarios"><div class="soft-card q-pa-lg">Usuarios (pendiente)</div></q-tab-panel>
        <q-tab-panel name="notificaciones"><div class="soft-card q-pa-lg">Notificaciones (pendiente)</div></q-tab-panel>
        <q-tab-panel name="plan"><div class="soft-card q-pa-lg">Plan y facturación (pendiente)</div></q-tab-panel>
        <q-tab-panel name="conexiones"><div class="soft-card q-pa-lg">Conexiones (pendiente)</div></q-tab-panel>
        <q-tab-panel name="carga"><div class="soft-card q-pa-lg">Carga de datos (pendiente)</div></q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import AccountTab from "pages/configuracion/AccountTab.vue";

const tab = ref('cuenta')
</script>

<style scoped>
.container {
  max-width: 1024px;
  margin: 0 auto;
}

/* Píldoras como el Figma */
.tabs-soft {
  background: #f6f5fb;
  border-radius: 14px;
  padding: 8px;
}
.q-tab.tab-pill {
  margin-right: 12px;
  background: #ffffff;
  border-radius: 12px;
  padding: 6px 18px;
  min-height: 38px;
  box-shadow: 0 2px 8px rgba(17, 16, 62, 0.06);
}
.q-tab--active.tab-pill {
  background: #6c5ce7;   /* morado estilo mock */
  color: #fff;
  font-weight: 700;
}
.soft-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(17,16,62,.06);
}
</style>
