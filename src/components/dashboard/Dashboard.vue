<template>
  <section class="bg-gray-50 min-h-screen flex">
    <!-- Sidebar Toggle Button -->
    <button
      @click="toggleSidebar"
      class="text-white fixed top-4 left-4 z-50 bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition"
    >
      <i class="pi pi-bars text-2xl"></i>
    </button>

    <!-- Sidebar -->
    <aside
      v-if="showSidebar"
      class="w-64 bg-white shadow-md p-6 fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Profile Section -->
      <div class="flex flex-col items-center mb-6">
        <img :src="userProfilePic" alt="Profile Picture" class="rounded-full w-24 h-24 mb-4" />
        <h2 class="text-xl font-semibold text-gray-800">{{ userName }}</h2>
        <p class="text-gray-500">Profile</p>
      </div>

      <!-- Sidebar Links -->
      <ul class="space-y-4">
        <li>
          <router-link
            to="/profile"
            class="text-gray-700 hover:text-blue-600 transition"
            :class="{ 'font-semibold text-blue-600': $route.path === '/profile' }"
          >
            Profile Settings
          </router-link>
        </li>
        <li>
          <router-link
            to="/settings"
            class="text-gray-700 hover:text-blue-600 transition"
            :class="{ 'font-semibold text-blue-600': $route.path === '/settings' }"
          >
            Account Settings
          </router-link>
        </li>
      </ul>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="mt-auto bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
      >
        Log Out
      </button>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 p-8 space-y-8">
      <!-- Welcome Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Welcome, {{ userName }}!</h1>
        <p class="text-gray-600">Use these tools to grow your business effectively.</p>
      </div>

      <!-- Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Business Overview Card -->
        <div class="card w-40">
          <div class="card__content text-center relative p-20 transition-transform duration-1000 text-white font-bold">
            <div class="card__front absolute top-0 bottom-0 right-0 left-0 p-8 bg-bgLight flex items-center justify-center">
              <h2 class="text-xl font-semibold text-gray-800">Business Overview</h2>
                <div class="mt-4 flex justify-between">
                  <div>
                    <p class="text-lg font-bold text-green-600">$12,345</p>
                    <p class="text-gray-500">Revenue (This Month)</p>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-red-600">98%</p>
                    <p class="text-gray-500">Customer Satisfaction</p>
                  </div>
                </div>
            </div>
            <div class="card__back absolute top-0 bottom-0 right-0 left-0 p-8 bg-bgLight flex items-center justify-center">
              <h2 class="text-xl font-semibold text-gray-800">Detailed Overview</h2>
                <div class="mt-4 space-y-2">
                  <p class="text-gray-600">Revenue Breakdown:</p>
                  <ul class="text-gray-500 list-disc list-inside">
                    <li>Product A: $5,000</li>
                    <li>Product B: $3,000</li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        <!-- Action Required Card -->
        <div class="card w-40">
          <div class="card__content text-center relative p-20 transition-transform duration-1000 text-white font-bold">
            <div class="card__front absolute top-0 bottom-0 right-0 left-0 p-8 bg-bgLight flex items-center justify-center">
              <h2 class="text-xl font-semibold text-gray-800">Action Required</h2>
                <ul class="mt-4 space-y-2 text-gray-600">
                  <li>Complete Business Assessment</li>
                  <li>Update Marketing Strategy</li>
                </ul>
            </div>
            <div class="card__back absolute top-0 bottom-0 right-0 left-0 p-8 bg-bgLight flex items-center justify-center">
              <h2 class="text-xl font-semibold text-gray-800">Detailed Actions</h2>
                <ul class="mt-4 space-y-2 text-gray-600">
                  <li>Review trends</li>
                  <li>Analyze competitors</li>
                </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools Section -->
      <h2 class="text-2xl font-bold text-gray-800">Your Tools</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="widget in widgets"
          :key="widget.title"
          class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <i :class="widget.icon + ' text-blue-600 mr-2'"></i>
            {{ widget.title }}
          </h3>
          <p class="text-gray-600 mb-4">{{ widget.description }}</p>
          <router-link :to="widget.link" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Go to {{ widget.title }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userName = ref("");
const userProfilePic = ref("path/to/default/profile-pic.jpg");
const showSidebar = ref(false);
const widgets = [
  { title: "ROI Calculator", description: "Predict your returns", link: "/roi", icon: "pi pi-calculator" },
  { title: "Business Assessment", description: "Assess your business", link: "/business", icon: "pi pi-briefcase" },
  { title: "Marketing Analysis", description: "Analyze marketing", link: "/analysis", icon: "pi pi-chart-line" },
  { title: "Trend Seeker", description: "Find latest trends", link: "/search", icon: "pi pi-search" },
];

// Sidebar toggle
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// User logout
const logout = async () => {
  await auth.signOut();
  router.push("/login");
};

// Fetch user data
onMounted(async () => {
  const user = auth.currentUser;
  if (!user) {
    router.push("/login");
  } else {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      userName.value = userDoc.data().username;
      userProfilePic.value = userDoc.data().profilePicture || userProfilePic.value;
    }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Oswald:400,700');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  height: 100vh;
  display: grid;
  place-items: center;
  font-family: 'Oswald', sans-serif;
}

.card { 
  perspective: 800px; 
  position: relative; /* Ensure correct positioning */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  transition: transform 0.6s; /* Transition effect */
  transform-style: preserve-3d; /* Preserve 3D effect */
}

.card__content {
  transform-style: preserve-3d; 
  transition: transform 0.5s; /* Optional for smoother animation */
}

.card:hover .card__content { 
  transform: rotateY(0.5turn); 
}

.card__front,
.card__back { 
  position: absolute; /* Position absolutely for overlay */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  backface-visibility: hidden; /* Hide back when not flipped */
  border-radius: 0.5rem; /* Rounded corners */
}

.card__back { 
  transform: rotateY(0.5turn); 
}
</style>
