<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/apiRequest'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'
import UserDetails from './User/UserDetails.vue'
import EditUser from './User/EditUser.vue'
import CreateUser from './User/CreateUser.vue'

const viewMode = ref('users')


const users = ref([])
const loading = ref(false)
const error = ref(null)

const profiles = ref([])
const loadingProfiles = ref(false)
const errorProfiles = ref(null)

const addresses = ref([])
const loadingAddresses = ref(false)
const errorAddresses = ref(null)

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

const goToUsers = () => {
    viewMode.value = 'users'
}

const goToProfiles = async () => {
    viewMode.value = 'profiles'
    if (!profiles.value.length) {
        await loadProfiles()
    }
}

const goToAddresses = async () => {
    viewMode.value = 'addresses'
    if (!addresses.value.length) {
        await loadAddresses()
    }
}

const onUserCreated = (user) => {
    users.value.push(user)
    viewMode.value = 'users'
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
    viewMode.value = 'users'
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
    viewMode.value = 'users'
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

const loadProfiles = async () => {
    loadingProfiles.value = true
    errorProfiles.value = null
    try {
        const { data } = await api.get('/profiles')
        profiles.value = data.data || data
    } catch (err) {
        errorProfiles.value = 'Erro ao carregar perfis'
        console.error(err)
    } finally {
        loadingProfiles.value = false
    }
}

const loadAddresses = async () => {
    loadingAddresses.value = true
    errorAddresses.value = null
    try {
        const { data } = await api.get('/addresses')
        addresses.value = data.data || data
    } catch (err) {
        errorAddresses.value = 'Erro ao carregar endereços'
        console.error(err)
    } finally {
        loadingAddresses.value = false
    }
}
</script>

<template>
    <div class="componente modal-user">
        <!-- LISTAS (usuários ou perfis) -->
        <div v-if="viewMode === 'users' || viewMode === 'profiles' || viewMode === 'addresses'">
            <div class="topo-lista">
                <var-button v-if="viewMode === 'users'" type="success" elevation class="btn-novo" @click="goToCreate">
                    + Novo usuário
                </var-button>

                <var-button v-else-if="viewMode === 'profiles'" type="success" elevation class="btn-novo"
                    @click="onCreateProfile">
                    + Novo perfil
                </var-button>

                <var-button v-else type="success" elevation class="btn-novo" @click="onCreateAddress">
                    + Novo endereço
                </var-button>

                <h1>
                    {{
                        viewMode === 'users'
                            ? 'Usuários'
                            : viewMode === 'profiles'
                                ? 'Perfis'
                                : 'Endereços'
                    }}
                </h1>

                <div class="acoes-topo">
                    <var-button type="default" outline="" class="btn-perfis" :class="{ 'btn-ativo': viewMode === 'users' }" @click="goToUsers">
                        Usuários
                    </var-button>
                    <var-button type="default" outline="" class="btn-perfis" :class="{ 'btn-ativo': viewMode === 'profiles' }" @click="goToProfiles">
                        Perfis
                    </var-button>
                    <var-button type="default" outline="" class="btn-perfis" :class="{ 'btn-ativo': viewMode === 'addresses' }" @click="goToAddresses">
                        Endereços
                    </var-button>
                </div>
            </div>

            <p v-if="viewMode === 'users' && loading">Carregando usuários...</p>
            <p v-else-if="viewMode === 'users' && error">{{ error }}</p>

            <!-- tabela usuários -->
            <table v-if="viewMode === 'users'" class="tabela-usuarios">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.nome }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.perfil.name }}</td>
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

            <!-- tabela perfis -->
            <table v-else-if="viewMode === 'profiles'" class="tabela-usuarios">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome do Perfil</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="profile in profiles" :key="profile.id">
                        <td>{{ profile.id }}</td>
                        <td>{{ profile.name }}</td>
                        <td class="acoes">
                            <var-button type="warning" elevation @click="onEditarPerfil(profile)">
                                Editar
                            </var-button>
                            <var-button type="danger" elevation @click="onExcluirPerfil(profile)">
                                Excluir
                            </var-button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- endereços -->
            <table v-else class="tabela-usuarios">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Rua</th>
                        <th>CEP</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="address in addresses" :key="address.id">
                        <td>{{ address.id }}</td>
                        <td>{{ address.street }}</td>
                        <td>{{ address.cep }}</td>
                        <td class="acoes">
                            <var-button type="warning" elevation @click="onEditarAddress(address)">
                                Editar
                            </var-button>
                            <var-button type="danger" elevation @click="onExcluirAddress(address)">
                                Excluir
                            </var-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

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

        <!-- Criar -->
        <div v-else-if="viewMode === 'create'">
            <CreateUser @created="onUserCreated" @cancel="onVoltar" />
        </div>

        <!-- Editar -->
        <div v-else-if="viewMode === 'edit'">
            <EditUser :user-id="editingUserId" @updated="onUserUpdated" @cancel="onVoltar" />
        </div>
    </div>
</template>

<style scoped>
.modal-user {
    min-height: 600px;
}

.acoes-topo {
    display: flex;
    gap: 8px;
    margin-left: auto;
}

.btn-ativo {
  background-color: #0b2607;
  color: #fff;
  border: 1px solid #1f4d1a;
}

.topo-lista {
    display: flex;
    align-items: center;
}

.topo-lista h1 {
    flex: 1;
    text-align: center;
}

.btn-perfis {
    margin-left: auto;
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
