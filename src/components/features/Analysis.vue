<script setup>
import axios from "axios"; // Import Axios for making HTTP requests
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"; // Import Chart.js components
import { ref, computed } from "vue"; // Vue reactive data
import { Bar } from "vue-chartjs"; // Chart.js Bar chart component

// Import API endpoint
import { getApiEndpoint } from '@/apiConfig';
const endpoint = getApiEndpoint(); // Get the API endpoint

// Registering necessary components for Chart.js
ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

// Reactive variables to store form inputs and API responses
const niche = ref(""); // Niche input
const location = ref(""); // Location input
const timeframe = ref(""); // Timeframe input
const apiResponse = ref(null); // To store the API response
const regionalResponse = ref(null); // To store regional interest data
const error = ref(""); // To display error messages
const downloadGraphOption = ref("interestScores"); // Default graph to download

// Reactive chartData for Bar chart
const chartData = ref({
  labels: [], // Dates from the API response
  datasets: [
    {
      label: "Interest Scores",
      backgroundColor: "#42A5F5",
      data: [], // Scores from the API response
    },
  ],
});

// Reactive chartData for Regional Interest Scores
const regionalChartData = ref({
  labels: [], // Regions from the API response
  datasets: [
    {
      label: "Regional Interest Scores",
      backgroundColor: "#FFA726",
      data: [], // Scores from the regional API response
    },
  ],
});

// Method to fetch interest score data from API based on form inputs
const fetchInterestScores = async () => {
  try {
    const response = await axios.get(`${endpoint}/trends/get-bar-graph-data`, {
      params: {
        niche: niche.value,
        location: location.value,
        timeframe: timeframe.value,
      },
    });

    // Check if the API response contains the required fields
    if (response.data.labels && response.data.values) {
      apiResponse.value = response.data; // Store the full response
      // Get top 5 highest scores and their corresponding labels
      const sortedData = response.data.values
        .map((value, index) => ({ value, label: response.data.labels[index] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      
      chartData.value.labels = sortedData.map(item => item.label);
      chartData.value.datasets[0].data = sortedData.map(item => item.value);
      error.value = ""; // Clear previous errors
    } else {
      error.value = "No data available for the given parameters.";
      apiResponse.value = null; // Clear any previous response
      chartData.value.labels = [];
      chartData.value.datasets[0].data = [];
    }
  } catch (err) {
    handleApiError(err);
  }
};

// Method to fetch regional interest data
const fetchRegionalInterestScores = async () => {
  try {
    const response = await axios.get(`${endpoint}/trends/interest_by_region`, {
      params: {
        niche: niche.value,
        location: location.value,
        timeframe: timeframe.value,
      },
    });

    // Check if the API response contains the required fields
    if (response.data.labels && response.data.values) {
      regionalResponse.value = response.data; // Store the full response
      // Get top 5 highest regional scores
      const sortedData = response.data.values
        .map((value, index) => ({ value, label: response.data.labels[index] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      regionalChartData.value.labels = sortedData.map(item => item.label);
      regionalChartData.value.datasets[0].data = sortedData.map(item => item.value);
      error.value = ""; // Clear previous errors
    } else {
      error.value = "No regional data available for the given parameters.";
      regionalResponse.value = null; // Clear any previous response
      regionalChartData.value.labels = [];
      regionalChartData.value.datasets[0].data = [];
    }
  } catch (err) {
    handleApiError(err);
  }
};

// Method to clear graphs and responses
const clearGraphs = () => {
  apiResponse.value = null;
  regionalResponse.value = null;
  chartData.value.labels = [];
  chartData.value.datasets[0].data = [];
  regionalChartData.value.labels = [];
  regionalChartData.value.datasets[0].data = [];
  error.value = ""; // Clear error message
};

// Method to download the selected graph as an image
const downloadGraph = () => {
  const canvasId = downloadGraphOption.value === "interestScores" ? "chartCanvas" : "regionalChartCanvas";
  const canvas = document.getElementById(canvasId);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = downloadGraphOption.value === "interestScores" ? 'interest_scores.png' : 'regional_interest_scores.png';
  link.click();
};

// Error handling function
const handleApiError = (err) => {
  if (err.response) {
    error.value = err.response.data.error || "An error occurred.";
  } else {
    error.value = "An error occurred while connecting to the API.";
  }
  apiResponse.value = null; // Clear any previous response
  chartData.value.labels = [];
  chartData.value.datasets[0].data = [];
  regionalResponse.value = null; // Clear any previous regional response
  regionalChartData.value.labels = [];
  regionalChartData.value.datasets[0].data = [];
};
</script>

<template>
  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-white shadow-md">
        
        <!-- Form Section for Interest Score Analysis -->
        <div class="p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-2xl font-bold">Interest Score Analysis</h2>
            <p class="mt-2 mb-4">
              Provide your niche, location, and timeframe to analyze interest scores.
            </p>

            <!-- Interest Score Analysis Form -->
            <form @submit.prevent="fetchInterestScores">
              <label for="niche" class="block mb-2">Niche</label>
              <input v-model="niche" type="text" id="niche" class="w-full p-2 mb-4 border border-gray-300 rounded-lg" placeholder="Enter your niche (e.g., coffee)" required />

              <label for="location" class="block mb-2">Location</label>
              <input v-model="location" type="text" id="location" class="w-full p-2 mb-4 border border-gray-300 rounded-lg" placeholder="Enter your location (e.g., US)" required />

              <label for="timeframe" class="block mb-2">Timeframe</label>
              <input v-model="timeframe" type="text" id="timeframe" class="w-full p-2 mb-4 border border-gray-300 rounded-lg" placeholder="e.g., today 12-m" required />

              <button type="submit" class="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer">Analyze</button>
              <button @click.prevent="fetchRegionalInterestScores" class="inline-block bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 cursor-pointer">Fetch Regional Data</button>
              <button @click.prevent="clearGraphs" class="inline-block bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 cursor-pointer">Clear Graphs</button>
              
              <div class="mt-4">
                <label for="downloadOption" class="block mb-2">Download Graph:</label>
                <select v-model="downloadGraphOption" id="downloadOption" class="border border-gray-300 rounded-lg p-2">
                  <option value="interestScores">Interest Scores</option>
                  <option value="regionalInterestScores">Regional Interest Scores</option>
                </select>
              </div>

              <button @click.prevent="downloadGraph" class="inline-block bg-yellow-600 text-white rounded-lg px-4 py-2 hover:bg-yellow-700 cursor-pointer">Download</button>
            </form>

            <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-600 rounded-lg">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- API Response Section -->
        <div class="p-6 flex flex-col justify-between">
          <div class="bg-white shadow-md rounded-lg p-4">
            <h3 class="text-xl font-semibold">API Response</h3>
            <pre v-if="apiResponse" class="mt-2 bg-gray-100 p-4 rounded">
              {{ JSON.stringify(apiResponse, null, 2) }}
            </pre>
            <div v-if="!apiResponse" class="mt-2 text-gray-500">
              No data received yet.
            </div>
          </div>
        </div>

        <!-- Bar Chart Section -->
        <div class="p-6 flex flex-col justify-between">
          <div class="bg-white shadow-md rounded-lg p-4">
            <h3 class="text-xl font-semibold">Interest Scores Chart</h3>
            <Bar v-if="chartData.labels.length > 0" :data="chartData" id="chartCanvas" :height="400" :width="600" />
            <div v-else class="mt-2 text-gray-500">No data to display in chart.</div>
          </div>
        </div>

        <!-- Regional Interest Chart Section -->
        <div class="p-6 flex flex-col justify-between">
          <div class="bg-white shadow-md rounded-lg p-4">
            <h3 class="text-xl font-semibold">Regional Interest Scores Chart</h3>
            <Bar v-if="regionalChartData.labels.length > 0" :data="regionalChartData" id="regionalChartCanvas" :height="400" :width="600" />
            <div v-else class="mt-2 text-gray-500">No regional data to display in chart.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional: Add any custom styles here */
</style>
