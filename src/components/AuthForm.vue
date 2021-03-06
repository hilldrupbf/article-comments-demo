<template>
  <div class="container">
    <form @submit.prevent="submitForm">
      <p class="title">{{ title }}</p>
      <div class="input-group">
        <input
          @focus="clearError"
          type="text"
          placeholder="Username"
          required
          v-model="username"
        />
      </div>
      <div class="input-group">
        <input
          type="password"
          placeholder="Password"
          minlength="8"
          required
          v-model="password"
        />
      </div>
      <div class="input-group" v-if="mode !== 'login'">
        <input
          @focus="clearError"
          type="password"
          minlength="8"
          placeholder="Re-enter Password"
          v-model="passwordRE"
          required
        />
      </div>
      <p @click="clearError" class="error" v-if="error">{{ error }}</p>
      <div class="input-group">
        <button type="submit">{{ buttonCaption }}</button>
      </div>
      <p>
        {{ bottomText }}<router-link :to="linkPath">{{ linkText }}</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  props: ['mode'],
  data() {
    return {
      username: '',
      password: '',
      passwordRE: '',
      isLoading: false,
    };
  },
  computed: {
    title() {
      return this.mode === 'login' ? 'Please Log In' : 'Enter Sign Up Info';
    },
    buttonCaption() {
      return this.mode === 'login' ? 'Login' : 'Sign Up';
    },
    bottomText() {
      return this.mode === 'login'
        ? 'No account yet? '
        : 'Already have an account? ';
    },
    linkText() {
      return this.mode === 'login' ? 'Sign up' : 'Login';
    },
    linkPath() {
      return this.mode === 'login' ? '/signup' : '/login';
    },
    error() {
      return this.$store.getters['getError'];
    },
  },
  methods: {
    async submitForm() {
      const authInfo = {
        username: this.username,
        password: this.password,
        passwordRE: this.passwordRE,
      };

      this.isLoading = true;

      if (this.mode === 'login') {
        await this.$store.dispatch('login', authInfo);
      } else {
        if (this.password !== this.passwordRE) {
          this.$store.dispatch('setError', 'ERROR: Passwords do not match');
          return;
        }
        await this.$store.dispatch('signup', authInfo);
      }

      this.isLoading = false;

      if (this.$store.getters['isLoggedIn']) {
        this.$emit('close');
        this.$router.replace('/');
      }
    },
    clearError() {
      this.$store.dispatch('clearError');
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  background: #fff;
}
.input-group {
  margin: 1rem;
  width: 100%;
}
.error {
  padding: 0.5rem;
  background: rgb(255, 157, 157);
  border: 2px solid red;
  border-radius: 5px;
  font-weight: bold;
}
input {
  width: 100%;
  line-height: 3rem;
  font-size: 1rem;
  padding: 0 0.3rem;
}
input:required {
  box-shadow: none;
}
input:invalid {
  box-shadow: none;
}
.title {
  display: flex;
  justify-content: center;
  width: calc(100% + 6rem);
  position: relative;
  margin-bottom: 1rem;
  padding: 1rem 0;
  background: #eee;
  border-bottom: 1px solid #e2e2e2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 1.5rem;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 20rem;
  border-radius: 10px;
  border: 1px solid #e2e2e2;
  padding: 0 3rem 2rem 3rem;
  background: #f5f5f5;
  margin: 0 1rem;
}
button {
  margin: 0 auto;
  width: 100%;
  height: 3rem;
  background-color: #2ea44f;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}
button:hover {
  background-color: #2c964a;
}
p {
  font-size: 0.9rem;
}
</style>
