<template>
  <div>

    <input type="file" name="image" accept=".png, .jpg, .jpeg, .webp, .gif" @change="handleUpload($event)">
  </div>
  <div>
    <q-img
      :src="props.image"
      spinner-color="white"
      style="height: 140px; max-width: 150px"
    ></q-img>
  </div>
</template>

<script setup>
import { useImage } from '../composables/useImage'

const props = defineProps({
  image: String
})
const emits = defineEmits(['update'])

const { uploadImage } = useImage()

const handleUpload = async (event) => {
  console.log(event)
  const data = new FormData()
  data.append('image', event.target.files[0])
  data.set('image_holder_id', 1)
  const imageUploaded = await uploadImage(data)
  if (!imageUploaded.error) {
    emits('update', imageUploaded.image)
  }
}
</script>
