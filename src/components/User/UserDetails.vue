<script setup>
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['back'])
</script>

<template>
    <div class="detalhes-card">
        <div class="detalhes-topo">
            <strong>#{{ user.id }}</strong>
            <button class="btn-voltar" @click="emit('back')">Voltar</button>
        </div>

        <div class="linha">
            <span class="label">Nome:</span>
            <span class="valor">{{ user.nome }}</span>
        </div>
        <div class="linha">
            <span class="label">Email:</span>
            <span class="valor">{{ user.email }}</span>
        </div>
        <div class="linha">
            <span class="label">CPF:</span>
            <span class="valor">{{ user.cpf }}</span>
        </div>
        <div class="linha">
            <span class="label">Perfil:</span>
            <span class="valor">{{ user.perfil?.name }}</span>
        </div>

        <div class="enderecos">
            <span class="label">Endereços:</span>
            <ul>
                <li v-for="address in user.enderecos" :key="address.id">
                    Rua: {{ address.street }} | CEP: {{ address.cep }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.detalhes-card {
    max-width: 700px;
    margin: 20px auto 0;
    padding: 18px 22px;
    border-radius: 10px;
    border: 1px solid #1f4d1a;
    background-color: #060f05;
    font-size: 1rem;
}

.detalhes-topo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.detalhes-topo strong {
    font-size: 1.05rem;
}

.btn-voltar {
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    background-color: #1f6feb;
    color: #fff;
    font-size: 0.9rem;
    cursor: pointer;
}

.btn-voltar:hover {
    background-color: #1653b3;
}

.linha {
    display: flex;
    gap: 10px;
    margin-bottom: 6px;
}

.label {
    min-width: 80px;
    font-weight: bold;
    color: #cfd8dc;
    font-size: 0.95rem;
}

.valor {
    color: #eceff1;
    font-size: 0.95rem;
}

.enderecos {
    margin-top: 10px;
}

.enderecos ul {
    margin: 6px 0 0;
    padding-left: 20px;
}

.enderecos li {
    margin-bottom: 4px;
    font-size: 0.95rem;
}
</style>