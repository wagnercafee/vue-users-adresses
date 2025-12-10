<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/apiRequest'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'
import UserDetails from './User/UserDetails.vue'
import EditUser from './User/EditUser.vue'
import CreateUser from './User/CreateUser.vue'

const viewMode = ref('list')

const users = ref([])
const loading = ref(false)
const error = ref(null)

const selectedUser = ref(null)
const loadingDetail = ref(false)
const errorDetail = ref(null)

const editingUserId = ref(null)


onMounted(async () => {
    loading.value = true
    error.value = null

    try {
        const response = await api.get('/users')
        users.value = response.data.data
    } catch (err) {
        error.value = 'Erro ao carregar usuários'
        console.error(err)
    } finally {
        loading.value = false
    }
})

const goToCreate = () => {
    viewMode.value = 'create'
}

const onUserCreated = (user) => {
    users.value.push(user)
    viewMode.value = 'list'
}

const onDetalhes = async (user) => {
    viewMode.value = 'detail'
    selectedUser.value = null
    loadingDetail.value = true
    errorDetail.value = null

    try {
        const response = await api.get(`/users/${user.id}`)
        selectedUser.value = response.data.data
    } catch (err) {
        errorDetail.value = 'Erro ao carregar detalhes'
        console.error(err)
    } finally {
        loadingDetail.value = false
    }
}

const onVoltar = () => {
    viewMode.value = 'list'
    selectedUser.value = null
}

const onEditar = (user) => {
    editingUserId.value = user.id
    viewMode.value = 'edit'
}

const loadUsers = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await api.get('/users')
        users.value = response.data.data
    } catch (err) {
        error.value = 'Erro ao carregar usuários'
        console.error(err)
    } finally {
        loading.value = false
    }
}

onMounted(loadUsers)

const onUserUpdated = async () => {
    await loadUsers()
    viewMode.value = 'list'
}


const onExcluir = async (user) => {
    const result = await Swal.fire({
        title: 'Confirmar exclusão',
        text: `Deseja realmente excluir o usuário ${user.nome}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#555555',
    })

    if (!result.isConfirmed) return

    try {
        await api.delete(`/users/${user.id}`)
        users.value = users.value.filter(u => u.id !== user.id)
        toast.success('Usuário excluído com sucesso')
    } catch (err) {
        console.error('Erro ao excluir usuário', err)
        toast.error('Erro ao excluir usuário')
    }
}

</script>

<template>
    <div class="componente modal-user">
        <!-- LISTA -->
        <template v-if="viewMode === 'list'">
            <div class="topo-lista">
                <h1>Usuários</h1>
                <button class="btn-novo" @click="goToCreate">
                    + Novo usuário
                </button>
            </div>

            <p v-if="loading">Carregando usuários...</p>
            <p v-else-if="error">{{ error }}</p>

            <table v-else class="tabela-usuarios">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.nome }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.cpf }}</td>
                        <td class="acoes">
                            <var-button type="primary" elevation @click="onDetalhes(user)">
                                Detalhes
                            </var-button>

                            <var-button type="warning" elevation @click="onEditar(user)">
                                Editar
                            </var-button>

                            <var-button type="danger" elevation @click="onExcluir(user)">
                                Excluir
                            </var-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>

        <!-- Detalhes -->
        <div v-else-if="viewMode === 'detail'">
            <h1>Detalhes do Usuário</h1>

            <div v-if="loadingDetail">
                Carregando detalhes...
            </div>
            <div v-else-if="errorDetail">
                {{ errorDetail }}
            </div>
            <UserDetails v-else-if="selectedUser" :user="selectedUser" @back="onVoltar" />
        </div>

        <div v-else-if="viewMode === 'create'">
            <CreateUser @created="onUserCreated" @cancel="onVoltar" />
        </div>

        <div v-else-if="viewMode === 'edit'">
            <EditUser :user-id="editingUserId" @updated="onUserUpdated" @cancel="onVoltar" />
        </div>

    </div>
</template>

<style scoped>
.modal-user {
    min-height: 600px;
}

.tabela-usuarios {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.tabela-usuarios th,
.tabela-usuarios td {
    border: 1px solid #1f4d1a;
    padding: 8px 10px;
}

.tabela-usuarios th {
    background-color: #0b2607;
    color: #fff;
    text-align: center;
}

.tabela-usuarios tr:nth-child(even) {
    background-color: #060f05;
}

.acoes {
    display: flex;
    justify-content: center;
    gap: 8px;
}
</style>
