<template>
    <table v-if="show">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome do Perfil</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="profile in profiles" :key="profile.id">
          <td>{{ profile.id }}</td>
          <td>{{ profile.name }}</td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    name: 'ProfilesTable',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      profiles: {
        type: Array,
        default: () => [],
      },
    },
  }
  </script>
  