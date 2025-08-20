<template>
  <div>
    <!-- Card principal -->
    <q-card class="soft-card q-pa-lg q-mb-md">
      <div class="row items-start q-col-gutter-lg">
        <!-- Avatar + subir imagen -->
        <div class="col-12 col-md-4">
          <div class="row items-center q-gutter-md">
            <q-avatar size="110px" class="bg-grey-3">
              <q-img v-if="previewUrl" :src="previewUrl" :ratio="1" />
              <q-img v-else src="https://cdn.quasar.dev/img/avatar.png" :ratio="1" />
            </q-avatar>

            <div class="column">
              <q-btn
                color="deep-purple-5"
                unelevated
                no-caps
                class="q-px-lg q-py-xs"
                label="Subir Imagen"
                @click="pickFile"
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
              <q-btn
                type="submit"
                color="deep-purple-5"
                unelevated
                label="Guardar"
                no-caps
              />
              <q-btn
                flat
                color="grey-7"
                label="Cancelar"
                no-caps
                @click="onCancel"
              />
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
import { ref, onBeforeUnmount } from 'vue'


const fileEl = ref(null)
const previewUrl = ref(null)

const form = ref({
  nombre: 'john',
  apellidos: 'Doe',
  email: 'johnDoe@example.com',
  idioma: 'en'
})

const idiomas = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' }
]

const confirmDelete = ref(false)

function pickFile () {
  fileEl.value?.click()
}

function onFileChange (e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 800 * 1024) {
    this?.$q?.notify?.({ type: 'warning', message: 'Máximo 800 KB' })
    e.target.value = ''
    return
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

async function onSubmit () {
  // TODO: integrar con tu API
  // await this.$axios.put('/settings/account', { ...form.value, avatar: fileEl.value.files?.[0] })
  this?.$q?.notify?.({ type: 'positive', message: 'Cuenta guardada' })
}

function onCancel () {
  // restablece/recarga valores reales según tu store
  this?.$q?.notify?.({ type: 'info', message: 'Cambios cancelados' })
}

function onDelete () {
  // TODO: llamada real de eliminación
  this?.$q?.dialog?.({
    title: 'Eliminar cuenta',
    message: 'Esta acción es irreversible. ¿Deseas continuar?',
    ok: { label: 'Sí, eliminar', color: 'negative' },
    cancel: { label: 'Cancelar', flat: true }
  }).onOk(() => {
    this?.$q?.notify?.({ type: 'negative', message: 'Cuenta eliminada (demo)' })
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
