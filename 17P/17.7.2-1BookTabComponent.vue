<!-- 17.7.2-1标签页组件BookTabComponent.vue -->

<template>
    <div class="tabComponent">
        <button
            v-for="tab in tabs"
            :key="tab.title"
            :class="['tab-button', { active: currentTab === tab.title }]"
            @click="currentTab = tab.title">
            {{ tab.displayName }}
        </button>

        <keep-alive>
            <component :is="currentTabComponent" :content="content" class="tab"></component>
        </keep-alive>
    </div>
</template>

<script>
import BookIntroduction from './BookIntroduction'
import BookCommentList from './BookCommentList'
import BookQA from './BookQA'

export default {
    name: 'TabComponent',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentTab: 'introduction',
            tabs: [
                { title: 'introduction', displayName: '图书介绍' },
                { title: 'comment', displayName: '图书评价' },
                { title: 'qa', displayName: '图书问答' },
            ]
        };
    },
    components: {
        BookIntroduction,
        BookComment: BookCommentList,
        BookQa: BookQA,
    },
    computed: {
        currentTabComponent: function() {
            return 'book-' + this.currentTab
        }
    }
}
</script>
