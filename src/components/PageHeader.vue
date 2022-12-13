<template>
  <div :class="`ma-4 text-center text-${textColor}`">
      <h4 class="mb-2">{{title}}</h4>
      <h6 class="mt-2">{{subtitle}}</h6>
  </div>
</template>

<script >
export default {
props: {
  title: '',
  subtitle: '',
  textColor: ''
}
};
</script>
