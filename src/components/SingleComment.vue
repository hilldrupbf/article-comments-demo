<template>
  <li class="main" :style="childStyles">
    <!-- <li class="main"> -->
    <div class="comment">
      <div class="comment-title">
        <a class="collapse" href="#" @click.prevent="isVisible = !isVisible"
          >[-]</a
        >
        <p class="username">{{ item.uname }}</p>
        <span class="rating">{{ timestamp }}</span>
      </div>
      <collapse-transition easing="ease-in-out">
        <p v-if="isVisible">{{ item.body }}</p>
      </collapse-transition>
    </div>
    <collapse-transition easing="ease-in-out">
      <div class="reply" v-if="isVisible">
        <button @click="toggleReply">
          {{ showReply ? 'Cancel' : 'Reply' }}
        </button>
      </div>
    </collapse-transition>
    <div v-if="showReply">
      <create-comment
        :depth="item.depth"
        :parentId="item.post_id"
        @commentPosted="showReply = false"
        @signin="emitSignin"
      />
    </div>
  </li>

  <collapse-transition easing="ease-in-out">
    <div v-if="item.children && isVisible">
      <template v-if="item.children && isVisible">
        <single-comment
          v-for="item in item.children"
          :key="item.post_id"
          :item="item"
          :visible="isVisible"
          @signin="emitSignin"
        />
      </template>
    </div>
  </collapse-transition>
</template>

<script>
import CreateComment from './CreateComment.vue';
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue';

export default {
  components: {
    CreateComment,
    CollapseTransition,
  },
  name: 'SingleComment',
  props: ['item'],
  emits: ['signin'],
  data() {
    return {
      isVisible: true,
      showReply: false,
    };
  },
  computed: {
    childStyles() {
      return {
        width: 50 - 50 * (this.item.depth * 0.1) + 'rem',
        'max-width': 100 - 10 * this.item.depth + 'vw',
      };
    },
    timestamp() {
      return new Date(this.item.timestamp).toLocaleString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    },
  },
  methods: {
    toggleReply() {
      this.showReply = !this.showReply;
    },
    emitSignin() {
      this.$emit('signin');
    },
  },
};
</script>

<style scoped>
a {
  color: black;
}
.main {
  list-style: none;
  margin: 0 0 0 auto;
  padding: 1rem 1rem 1rem 1rem;
}
.comment {
  background: #e9e9e9;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 10px;
  margin: 0 0;
  padding: 0.5rem;
}
.comment-title {
  font-size: 1rem;
  display: flex;
  padding-bottom: 0.25rem;
}
.collapse {
  display: inline;
}
.username {
  display: inline;
  margin: 0 0.25rem;
  font-weight: bold;
}
.rating {
  font-size: 0.85em;
}
.btn {
  width: 30px;
}
.downvote {
  transform: rotate(180deg);
}
.reply {
  display: flex;
  justify-content: flex-end;
}
button {
  height: 2rem;
  width: 4rem;
  border: none;
  background: #d7d7d7;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
button:hover {
  background: #999;
  cursor: pointer;
}
</style>
