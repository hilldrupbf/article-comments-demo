<template>
  <div class="main-create">
    <form @submit.prevent="postComment">
      <input
        type="text"
        id="comment"
        :placeholder="placeholderText"
        v-model="commentBody"
        :disabled="!isLoggedIn"
        required
      />
      <button class="btn" v-if="isLoggedIn">Submit</button>
    </form>
    <button class="btn" @click="handleSigninClick" v-if="!isLoggedIn">
      Sign In
    </button>
  </div>
</template>

<script>
export default {
  props: ['depth', 'parentId'],
  emits: ['signin', 'commentPosted'],
  data() {
    return {
      commentBody: '',
    };
  },
  computed: {
    uname() {
      return this.$store.getters['getUser'];
    },
    isLoggedIn() {
      return this.$store.getters['isLoggedIn'];
    },
    placeholderText() {
      return this.isLoggedIn ? 'Post a comment!' : 'Sign in to post a comment';
    },
  },
  methods: {
    postComment() {
      this.$store.dispatch('postComment', {
        depth: parseInt(this.depth) + 1,
        uname: this.uname,
        commentBody: this.commentBody,
        parentId: this.parentId,
      });
      this.$store.dispatch('loadComments');
      this.$emit('commentPosted');
      this.commentBody = '';
    },
    handleSigninClick() {
      // this.$router.push('/login');
      this.$emit('signin');
    },
  },
};
</script>

<style scoped>
#comment {
  background: inherit;
  width: 100%;
  display: inline;
  font-size: 1em;
  padding: 0.25rem;
  border: none;
  border-bottom: 2px solid black;
  /* color: #888; */
}
#comment:focus {
  outline: none;
}

.btn {
  margin: 0 0 0 auto;
  display: inline;
  height: 50px;
  width: 80px;
  font-weight: bold;
  background: #ddd;
  border: none;
  border-bottom: 2px solid black;
}
.btn:hover {
  background: #bbb;
  cursor: pointer;
}
.main-create {
  margin: 2rem auto 0.5rem auto;
  min-width: 17rem;
  max-width: 60rem;
  display: flex;
  align-items: flex-end;
}
form {
  display: flex;
  width: 100%;
}
input {
  color: black;
}
input:invalid {
  box-shadow: none;
}
input:focus::placeholder {
  font-size: 1.1rem;
}
</style>
