<!-- 17.7.1加减按钮组件AddSubtractButton.vue -->

<template>
    <div class="addSubtractButton">
        <input v-model="quantity" type="number">
        <div>
            <a class="add" href="javascript:;" @click="handleAdd">+</a>
            <a class="sub" @click="handleSubtract"
                :class="{ disabled: quantity === 0 , actived: quantity > 0 }"
                href="javascript:;" >
                -
            </a>
        </div>
    </div>
</template>

<script>
    
export default {
    name: 'AddSubtractButton',
    data() {
        return {
            quantity: 0
        }
    },
    methods: {
        handleAdd() {
            this.quantity++;
            this.$emit("update-quantity", this.quantity);
        },
        handleSubtract() {
            this.quantity--;
            this.$emit("update-quantity", this.quantity);
        }
    }
}
</script>