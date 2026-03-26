const WardHourly = require('../models/WardHourly');
const Prediction = require('../models/Prediction');
const Alert = require('../models/Alert');

const Station = require('../models/Station');
const aiPredictionService = require('../services/aiPredictionService');
const axios = require('axios');
const aqiService = require('../services/aqiService');
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Predefined list of Indian States & UTs for national overview
const majorStates = [
    { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400 },
    { name: 'Arunachal Pradesh', lat: 28.2180, lng: 94.7278 },
    { name: 'Assam', lat: 26.2006, lng: 92.9376 },
    { name: 'Bihar', lat: 25.0961, lng: 85.3131 },
    { name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661 },
    { name: 'Goa', lat: 15.2993, lng: 74.1240 },
    { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
    { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
    { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
    { name: 'Jharkhand', lat: 23.6102, lng: 85.2799 },
    { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
    { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
    { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569 },
    { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
    { name: 'Manipur', lat: 24.6637, lng: 93.9063 },
    { name: 'Meghalaya', lat: 25.4670, lng: 91.3662 },
    { name: 'Mizoram', lat: 23.1645, lng: 92.9376 },
    { name: 'Nagaland', lat: 26.1584, lng: 94.5624 },
    { name: 'Odisha', lat: 20.9517, lng: 85.0985 },
    { name: 'Punjab', lat: 31.1471, lng: 75.3412 },
    { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
    { name: 'Sikkim', lat: 27.5330, lng: 88.5122 },
    { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
    { name: 'Telangana', lat: 18.1124, lng: 79.0193 },
    { name: 'Tripura', lat: 23.9408, lng: 91.9882 },
    { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9461 },
    { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193 },
    { name: 'West Bengal', lat: 22.9868, lng: 87.8550 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { name: 'Jammu & Kashmir', lat: 33.7782, lng: 76.5762 }
];

const majorCitiesByState = {
    'Maharashtra': [
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        { name: 'Pune', lat: 18.5204, lng: 73.8567 },
        { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
        { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
        { name: 'Thane', lat: 19.2183, lng: 72.9781 },
        { name: 'Aurangabad', lat: 19.8762, lng: 75.3433 },
        { name: 'Solapur', lat: 17.6599, lng: 75.9064 },
        { name: 'Kolhapur', lat: 16.7050, lng: 74.2433 },
        { name: 'Amravati', lat: 20.9320, lng: 77.7523 },
        { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 },
        { name: 'Sangli', lat: 16.8524, lng: 74.5815 },
        { name: 'Jalgaon', lat: 21.0077, lng: 75.5626 },
        { name: 'Akola', lat: 20.7002, lng: 77.0082 },
        { name: 'Latur', lat: 18.4088, lng: 76.5604 },
        { name: 'Dhule', lat: 20.9042, lng: 74.7749 },
        { name: 'Ahmednagar', lat: 19.0948, lng: 74.7480 },
        { name: 'Chandrapur', lat: 19.9615, lng: 79.2961 },
        { name: 'Parbhani', lat: 19.2608, lng: 76.7748 },
        { name: 'Ratnagiri', lat: 16.9902, lng: 73.3120 }
    ],
    'Uttar Pradesh': [
        { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
        { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
        { name: 'Agra', lat: 27.1767, lng: 78.0081 },
        { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
        { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
        { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
        { name: 'Allahabad', lat: 25.4358, lng: 81.8463 },
        { name: 'Bareilly', lat: 28.3670, lng: 79.4304 },
        { name: 'Aligarh', lat: 27.8974, lng: 78.0880 },
        { name: 'Moradabad', lat: 28.8386, lng: 78.7733 },
        { name: 'Saharanpur', lat: 29.9680, lng: 77.5510 },
        { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732 },
        { name: 'Noida', lat: 28.5355, lng: 77.3910 },
        { name: 'Firozabad', lat: 27.1591, lng: 78.3957 },
        { name: 'Jhansi', lat: 25.4484, lng: 78.5685 },
        { name: 'Mathura', lat: 27.4924, lng: 77.6737 },
        { name: 'Etawah', lat: 26.7856, lng: 79.0158 },
        { name: 'Muzaffarnagar', lat: 29.4727, lng: 77.7085 },
        { name: 'Shahjahanpur', lat: 27.8813, lng: 79.9110 },
        { name: 'Ayodhya', lat: 26.7922, lng: 82.1998 }
    ],
    'Delhi': [
        { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
        { name: 'North Delhi', lat: 28.7500, lng: 77.1167 },
        { name: 'South Delhi', lat: 28.4833, lng: 77.1833 },
        { name: 'Dwarka', lat: 28.5823, lng: 77.0500 },
        { name: 'East Delhi', lat: 28.6280, lng: 77.2950 },
        { name: 'West Delhi', lat: 28.6517, lng: 77.1000 },
        { name: 'Rohini', lat: 28.7495, lng: 77.0565 },
        { name: 'Shahdara', lat: 28.6739, lng: 77.2893 },
        { name: 'Najafgarh', lat: 28.6093, lng: 76.9799 },
        { name: 'Narela', lat: 28.8530, lng: 77.0932 }
    ],
    'Karnataka': [
        { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
        { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
        { name: 'Hubli', lat: 15.3647, lng: 75.1240 },
        { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
        { name: 'Belgaum', lat: 15.8497, lng: 74.4977 },
        { name: 'Gulbarga', lat: 17.3297, lng: 76.8343 },
        { name: 'Davangere', lat: 14.4644, lng: 75.9218 },
        { name: 'Bellary', lat: 15.1394, lng: 76.9214 },
        { name: 'Shimoga', lat: 13.9299, lng: 75.5681 },
        { name: 'Tumkur', lat: 13.3379, lng: 77.1173 },
        { name: 'Raichur', lat: 16.2076, lng: 77.3463 },
        { name: 'Bijapur', lat: 16.8302, lng: 75.7100 },
        { name: 'Udupi', lat: 13.3409, lng: 74.7421 }
    ],
    'Gujarat': [
        { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
        { name: 'Surat', lat: 21.1702, lng: 72.8311 },
        { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
        { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
        { name: 'Bhavnagar', lat: 21.7645, lng: 72.1519 },
        { name: 'Jamnagar', lat: 22.4707, lng: 70.0577 },
        { name: 'Junagadh', lat: 21.5222, lng: 70.4579 },
        { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
        { name: 'Anand', lat: 22.5645, lng: 72.9289 },
        { name: 'Navsari', lat: 20.9467, lng: 72.9520 },
        { name: 'Morbi', lat: 22.8173, lng: 70.8370 },
        { name: 'Bharuch', lat: 21.7051, lng: 72.9959 },
        { name: 'Porbandar', lat: 21.6417, lng: 69.6293 },
        { name: 'Vapi', lat: 20.3718, lng: 72.9050 },
        { name: 'Mehsana', lat: 23.5880, lng: 72.3693 }
    ],
    'West Bengal': [
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
        { name: 'Howrah', lat: 22.5851, lng: 88.3137 },
        { name: 'Durgapur', lat: 23.5204, lng: 87.3119 },
        { name: 'Asansol', lat: 23.6888, lng: 86.9661 },
        { name: 'Siliguri', lat: 26.7271, lng: 88.3953 },
        { name: 'Bardhaman', lat: 23.2324, lng: 87.8615 },
        { name: 'Malda', lat: 25.0108, lng: 88.1411 },
        { name: 'Baharampur', lat: 24.1024, lng: 88.2511 },
        { name: 'Haldia', lat: 22.0257, lng: 88.0583 },
        { name: 'Kharagpur', lat: 22.3460, lng: 87.2320 },
        { name: 'Darjeeling', lat: 27.0410, lng: 88.2663 },
        { name: 'Krishnanagar', lat: 23.4013, lng: 88.4959 }
    ],
    'Tamil Nadu': [
        { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
        { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
        { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
        { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
        { name: 'Salem', lat: 11.6643, lng: 78.1460 },
        { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
        { name: 'Erode', lat: 11.3410, lng: 77.7172 },
        { name: 'Vellore', lat: 12.9165, lng: 79.1325 },
        { name: 'Thoothukudi', lat: 8.7642, lng: 78.1348 },
        { name: 'Thanjavur', lat: 10.7870, lng: 79.1378 },
        { name: 'Tiruppur', lat: 11.1085, lng: 77.3411 },
        { name: 'Dindigul', lat: 10.3624, lng: 77.9695 },
        { name: 'Kanchipuram', lat: 12.8342, lng: 79.7036 },
        { name: 'Nagercoil', lat: 8.1833, lng: 77.4119 },
        { name: 'Hosur', lat: 12.7409, lng: 77.8253 }
    ],
    'Telangana': [
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
        { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
        { name: 'Nizamabad', lat: 18.6725, lng: 78.0940 },
        { name: 'Karimnagar', lat: 18.4386, lng: 79.1288 },
        { name: 'Khammam', lat: 17.2473, lng: 80.1514 },
        { name: 'Mahbubnagar', lat: 16.7488, lng: 78.0035 },
        { name: 'Adilabad', lat: 19.6640, lng: 78.5320 },
        { name: 'Nalgonda', lat: 17.0575, lng: 79.2690 },
        { name: 'Siddipet', lat: 18.1018, lng: 78.8520 },
        { name: 'Secunderabad', lat: 17.4399, lng: 78.4983 }
    ],
    'Rajasthan': [
        { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
        { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
        { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
        { name: 'Kota', lat: 25.2138, lng: 75.8648 },
        { name: 'Ajmer', lat: 26.4499, lng: 74.6399 },
        { name: 'Bikaner', lat: 28.0229, lng: 73.3119 },
        { name: 'Alwar', lat: 27.5530, lng: 76.6346 },
        { name: 'Bhilwara', lat: 25.3407, lng: 74.6313 },
        { name: 'Sikar', lat: 27.6094, lng: 75.1399 },
        { name: 'Sri Ganganagar', lat: 29.9038, lng: 73.8772 },
        { name: 'Pali', lat: 25.7711, lng: 73.3234 },
        { name: 'Bharatpur', lat: 27.2152, lng: 77.5030 },
        { name: 'Jaisalmer', lat: 26.9157, lng: 70.9083 },
        { name: 'Chittorgarh', lat: 24.8887, lng: 74.6269 },
        { name: 'Tonk', lat: 26.1664, lng: 75.7885 }
    ],
    'Madhya Pradesh': [
        { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
        { name: 'Indore', lat: 22.7196, lng: 75.8577 },
        { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
        { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 },
        { name: 'Ujjain', lat: 23.1765, lng: 75.7885 },
        { name: 'Sagar', lat: 23.8388, lng: 78.7378 },
        { name: 'Dewas', lat: 22.9676, lng: 76.0534 },
        { name: 'Satna', lat: 24.6005, lng: 80.8322 },
        { name: 'Ratlam', lat: 23.3315, lng: 75.0367 },
        { name: 'Rewa', lat: 24.5373, lng: 81.2960 },
        { name: 'Katni', lat: 23.8347, lng: 80.3930 },
        { name: 'Singrauli', lat: 24.1996, lng: 82.6754 },
        { name: 'Burhanpur', lat: 21.3104, lng: 76.2301 }
    ],
    'Bihar': [
        { name: 'Patna', lat: 25.5941, lng: 85.1376 },
        { name: 'Gaya', lat: 24.7955, lng: 85.0002 },
        { name: 'Muzaffarpur', lat: 26.1197, lng: 85.3910 },
        { name: 'Bhagalpur', lat: 25.2425, lng: 86.9842 },
        { name: 'Darbhanga', lat: 26.1542, lng: 85.8918 },
        { name: 'Purnia', lat: 25.7771, lng: 87.4753 },
        { name: 'Bihar Sharif', lat: 25.1982, lng: 85.5204 },
        { name: 'Arrah', lat: 25.5541, lng: 84.6644 },
        { name: 'Begusarai', lat: 25.4182, lng: 86.1272 },
        { name: 'Katihar', lat: 25.5548, lng: 87.5616 },
        { name: 'Munger', lat: 25.3708, lng: 86.4734 },
        { name: 'Chhapra', lat: 25.7804, lng: 84.7493 },
        { name: 'Saharsa', lat: 25.8777, lng: 86.5972 }
    ],
    'Andhra Pradesh': [
        { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
        { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
        { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
        { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
        { name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
        { name: 'Kakinada', lat: 16.9891, lng: 82.2475 },
        { name: 'Rajahmundry', lat: 17.0005, lng: 81.8040 },
        { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
        { name: 'Anantapur', lat: 14.6819, lng: 77.6006 },
        { name: 'Kadapa', lat: 14.4674, lng: 78.8241 },
        { name: 'Vizianagaram', lat: 18.1067, lng: 83.3956 },
        { name: 'Eluru', lat: 16.7107, lng: 81.0952 },
        { name: 'Ongole', lat: 15.5057, lng: 80.0499 },
        { name: 'Srikakulam', lat: 18.2949, lng: 83.8938 },
        { name: 'Amaravati', lat: 16.5103, lng: 80.5167 }
    ],
    'Punjab': [
        { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
        { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
        { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
        { name: 'Jalandhar', lat: 31.3260, lng: 75.5762 },
        { name: 'Patiala', lat: 30.3398, lng: 76.3869 },
        { name: 'Bathinda', lat: 30.2110, lng: 74.9455 },
        { name: 'Pathankot', lat: 32.2643, lng: 75.6421 },
        { name: 'Mohali', lat: 30.7046, lng: 76.7179 },
        { name: 'Hoshiarpur', lat: 31.5143, lng: 75.9115 },
        { name: 'Moga', lat: 30.8185, lng: 75.1741 },
        { name: 'Firozpur', lat: 30.9330, lng: 74.6134 },
        { name: 'Kapurthala', lat: 31.3804, lng: 75.3565 }
    ],
    'Haryana': [
        { name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
        { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
        { name: 'Panipat', lat: 29.3909, lng: 76.9635 },
        { name: 'Ambala', lat: 30.3752, lng: 76.7821 },
        { name: 'Karnal', lat: 29.6857, lng: 76.9905 },
        { name: 'Hisar', lat: 29.1492, lng: 75.7217 },
        { name: 'Rohtak', lat: 28.8955, lng: 76.6066 },
        { name: 'Sonipat', lat: 28.9467, lng: 77.0220 },
        { name: 'Sirsa', lat: 29.5340, lng: 75.0267 },
        { name: 'Bhiwani', lat: 28.7979, lng: 76.1319 },
        { name: 'Jind', lat: 29.3166, lng: 76.3140 },
        { name: 'Rewari', lat: 28.1971, lng: 76.6190 },
        { name: 'Yamunanagar', lat: 30.1290, lng: 77.2674 }
    ],
    'Kerala': [
        { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
        { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
        { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 },
        { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
        { name: 'Kollam', lat: 8.8932, lng: 76.6141 },
        { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
        { name: 'Palakkad', lat: 10.7867, lng: 76.6548 },
        { name: 'Alappuzha', lat: 9.4981, lng: 76.3388 },
        { name: 'Kottayam', lat: 9.5916, lng: 76.5222 },
        { name: 'Malappuram', lat: 11.0510, lng: 76.0711 },
        { name: 'Kasaragod', lat: 12.4996, lng: 74.9869 },
        { name: 'Munnar', lat: 10.0889, lng: 77.0595 },
        { name: 'Wayanad', lat: 11.6854, lng: 76.1320 }
    ],
    'Odisha': [
        { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
        { name: 'Cuttack', lat: 20.4625, lng: 85.8828 },
        { name: 'Rourkela', lat: 22.2604, lng: 84.8536 },
        { name: 'Berhampur', lat: 19.3150, lng: 84.7941 },
        { name: 'Sambalpur', lat: 21.4669, lng: 83.9756 },
        { name: 'Puri', lat: 19.8135, lng: 85.8312 },
        { name: 'Balasore', lat: 21.4934, lng: 86.9249 },
        { name: 'Baripada', lat: 21.9322, lng: 86.7252 },
        { name: 'Bhadrak', lat: 21.0546, lng: 86.4956 },
        { name: 'Jharsuguda', lat: 21.8554, lng: 84.0063 },
        { name: 'Jeypore', lat: 18.8563, lng: 82.5716 },
        { name: 'Angul', lat: 20.8408, lng: 85.0985 }
    ],
    'Jharkhand': [
        { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
        { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
        { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
        { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
        { name: 'Hazaribagh', lat: 23.9966, lng: 85.3591 },
        { name: 'Deoghar', lat: 24.4764, lng: 86.6915 },
        { name: 'Giridih', lat: 24.1854, lng: 86.3003 },
        { name: 'Ramgarh', lat: 23.6307, lng: 85.5614 },
        { name: 'Dumka', lat: 24.2680, lng: 87.2499 },
        { name: 'Chaibasa', lat: 22.5567, lng: 85.8028 }
    ],
    'Chhattisgarh': [
        { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
        { name: 'Bhilai', lat: 21.1938, lng: 81.3509 },
        { name: 'Bilaspur', lat: 22.0796, lng: 82.1391 },
        { name: 'Korba', lat: 22.3595, lng: 82.7501 },
        { name: 'Durg', lat: 21.1904, lng: 81.2849 },
        { name: 'Rajnandgaon', lat: 21.0970, lng: 81.0286 },
        { name: 'Jagdalpur', lat: 19.0788, lng: 82.0217 },
        { name: 'Ambikapur', lat: 23.1248, lng: 83.2006 },
        { name: 'Raigarh', lat: 21.8974, lng: 83.3950 },
        { name: 'Dhamtari', lat: 20.7071, lng: 81.5479 }
    ],
    'Assam': [
        { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
        { name: 'Silchar', lat: 24.8333, lng: 92.7789 },
        { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
        { name: 'Jorhat', lat: 26.7509, lng: 94.2037 },
        { name: 'Nagaon', lat: 26.3500, lng: 92.6838 },
        { name: 'Tinsukia', lat: 27.4860, lng: 95.3624 },
        { name: 'Tezpur', lat: 26.6338, lng: 92.8006 },
        { name: 'Bongaigaon', lat: 26.4769, lng: 90.5587 },
        { name: 'Karimganj', lat: 24.8649, lng: 92.3520 },
        { name: 'Goalpara', lat: 26.1672, lng: 90.6241 },
        { name: 'Dhubri', lat: 26.0184, lng: 89.9823 },
        { name: 'Lakhimpur', lat: 27.2360, lng: 94.1022 }
    ],
    'Uttarakhand': [
        { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
        { name: 'Haridwar', lat: 29.9457, lng: 78.1642 },
        { name: 'Nainital', lat: 29.3919, lng: 79.4542 },
        { name: 'Roorkee', lat: 29.8543, lng: 77.8880 },
        { name: 'Haldwani', lat: 29.2183, lng: 79.5130 },
        { name: 'Rudrapur', lat: 28.9738, lng: 79.3960 },
        { name: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
        { name: 'Kashipur', lat: 29.2139, lng: 78.9619 },
        { name: 'Almora', lat: 29.5892, lng: 79.6467 },
        { name: 'Mussoorie', lat: 30.4598, lng: 78.0644 },
        { name: 'Pithoragarh', lat: 29.5829, lng: 80.2179 },
        { name: 'Kotdwar', lat: 29.7469, lng: 78.5261 }
    ],
    'Himachal Pradesh': [
        { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
        { name: 'Manali', lat: 32.2396, lng: 77.1887 },
        { name: 'Dharamsala', lat: 32.2190, lng: 76.3234 },
        { name: 'Solan', lat: 30.9045, lng: 77.0967 },
        { name: 'Mandi', lat: 31.7088, lng: 76.9318 },
        { name: 'Kullu', lat: 31.9592, lng: 77.1089 },
        { name: 'Bilaspur', lat: 31.3387, lng: 76.7495 },
        { name: 'Hamirpur', lat: 31.6848, lng: 76.5211 },
        { name: 'Una', lat: 31.4685, lng: 76.2708 },
        { name: 'Palampur', lat: 32.1109, lng: 76.5361 },
        { name: 'Nahan', lat: 30.5590, lng: 77.2960 },
        { name: 'Chamba', lat: 32.5534, lng: 76.1258 },
        { name: 'Dalhousie', lat: 32.5333, lng: 75.9633 }
    ],
    'Goa': [
        { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
        { name: 'Margao', lat: 15.2832, lng: 73.9862 },
        { name: 'Vasco da Gama', lat: 15.3982, lng: 73.8113 },
        { name: 'Mapusa', lat: 15.5937, lng: 73.8091 },
        { name: 'Ponda', lat: 15.4012, lng: 74.0093 },
        { name: 'Bicholim', lat: 15.5904, lng: 73.9485 },
        { name: 'Curchorem', lat: 15.2636, lng: 74.1068 },
        { name: 'Cuncolim', lat: 15.1763, lng: 73.9915 },
        { name: 'Pernem', lat: 15.7234, lng: 73.7955 },
        { name: 'Canacona', lat: 15.0078, lng: 74.0489 },
        { name: 'Quepem', lat: 15.2126, lng: 74.0609 },
        { name: 'Sanguem', lat: 15.2279, lng: 74.1513 },
        { name: 'Calangute', lat: 15.5449, lng: 73.7546 },
        { name: 'Candolim', lat: 15.5171, lng: 73.7619 }
    ],
    'Jammu & Kashmir': [
        { name: 'Jammu', lat: 32.7266, lng: 74.8570 },
        { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
        { name: 'Leh', lat: 34.1526, lng: 77.5771 },
        { name: 'Anantnag', lat: 33.7311, lng: 75.1487 },
        { name: 'Baramulla', lat: 34.2078, lng: 74.3436 },
        { name: 'Sopore', lat: 34.3005, lng: 74.4710 },
        { name: 'Udhampur', lat: 32.9160, lng: 75.1327 },
        { name: 'Kathua', lat: 32.3862, lng: 75.5197 },
        { name: 'Pulwama', lat: 33.8726, lng: 74.8939 },
        { name: 'Kupwara', lat: 34.5291, lng: 74.2617 },
        { name: 'Kargil', lat: 34.5539, lng: 76.1349 },
        { name: 'Poonch', lat: 33.7712, lng: 74.0950 }
    ],
    'Manipur': [
        { name: 'Imphal', lat: 24.8170, lng: 93.9368 },
        { name: 'Thoubal', lat: 24.6353, lng: 93.9986 },
        { name: 'Bishnupur', lat: 24.6308, lng: 93.7727 },
        { name: 'Churachandpur', lat: 24.3362, lng: 93.6805 },
        { name: 'Kakching', lat: 24.4979, lng: 93.9820 },
        { name: 'Ukhrul', lat: 25.1139, lng: 94.3644 },
        { name: 'Senapati', lat: 25.2694, lng: 94.0193 },
        { name: 'Tamenglong', lat: 25.0163, lng: 93.4958 }
    ],
    'Meghalaya': [
        { name: 'Shillong', lat: 25.5788, lng: 91.8933 },
        { name: 'Tura', lat: 25.5142, lng: 90.2148 },
        { name: 'Jowai', lat: 25.4521, lng: 92.2017 },
        { name: 'Nongpoh', lat: 25.8961, lng: 91.8827 },
        { name: 'Williamnagar', lat: 25.4903, lng: 90.6167 },
        { name: 'Baghmara', lat: 25.2025, lng: 90.6358 },
        { name: 'Nongstoin', lat: 25.5169, lng: 91.2646 },
        { name: 'Resubelpara', lat: 25.8667, lng: 90.5000 }
    ],
    'Nagaland': [
        { name: 'Kohima', lat: 25.6751, lng: 94.1086 },
        { name: 'Dimapur', lat: 25.9042, lng: 93.7264 },
        { name: 'Mokokchung', lat: 26.3204, lng: 94.5143 },
        { name: 'Tuensang', lat: 26.2672, lng: 94.8293 },
        { name: 'Wokha', lat: 26.0980, lng: 94.2636 },
        { name: 'Mon', lat: 26.7138, lng: 94.9131 },
        { name: 'Zunheboto', lat: 25.9656, lng: 94.5178 },
        { name: 'Phek', lat: 25.6683, lng: 94.4827 }
    ],
    'Arunachal Pradesh': [
        { name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
        { name: 'Naharlagun', lat: 27.1045, lng: 93.6880 },
        { name: 'Pasighat', lat: 28.0668, lng: 95.3304 },
        { name: 'Tawang', lat: 27.5860, lng: 91.8687 },
        { name: 'Ziro', lat: 27.5388, lng: 93.8308 },
        { name: 'Bomdila', lat: 27.2645, lng: 92.4159 },
        { name: 'Along', lat: 28.1688, lng: 94.7610 },
        { name: 'Tezu', lat: 27.9189, lng: 96.1607 },
        { name: 'Roing', lat: 28.1400, lng: 95.8477 },
        { name: 'Namsai', lat: 27.7027, lng: 95.8545 }
    ],
    'Tripura': [
        { name: 'Agartala', lat: 23.8315, lng: 91.2868 },
        { name: 'Dharmanagar', lat: 24.3750, lng: 92.1730 },
        { name: 'Udaipur', lat: 23.5332, lng: 91.4879 },
        { name: 'Kailashahar', lat: 24.3312, lng: 92.0061 },
        { name: 'Ambassa', lat: 23.9222, lng: 91.8580 },
        { name: 'Belonia', lat: 23.2536, lng: 91.4560 },
        { name: 'Khowai', lat: 24.0667, lng: 91.6167 },
        { name: 'Sabroom', lat: 23.0039, lng: 91.7167 }
    ],
    'Mizoram': [
        { name: 'Aizawl', lat: 23.7271, lng: 92.7176 },
        { name: 'Lunglei', lat: 22.8868, lng: 92.7345 },
        { name: 'Champhai', lat: 23.4567, lng: 93.3281 },
        { name: 'Serchhip', lat: 23.3087, lng: 92.8466 },
        { name: 'Kolasib', lat: 24.2250, lng: 92.6813 },
        { name: 'Lawngtlai', lat: 22.5289, lng: 92.8977 },
        { name: 'Saiha', lat: 22.4898, lng: 92.9719 },
        { name: 'Mamit', lat: 23.9256, lng: 92.4875 }
    ],
    'Sikkim': [
        { name: 'Gangtok', lat: 27.3389, lng: 88.6065 },
        { name: 'Namchi', lat: 27.1680, lng: 88.3621 },
        { name: 'Mangan', lat: 27.5095, lng: 88.5232 },
        { name: 'Gyalshing', lat: 27.2898, lng: 88.2526 },
        { name: 'Ravangla', lat: 27.3079, lng: 88.3641 },
        { name: 'Pelling', lat: 27.3006, lng: 88.2395 },
        { name: 'Jorethang', lat: 27.1030, lng: 88.3173 },
        { name: 'Singtam', lat: 27.2350, lng: 88.5027 }
    ]
};

const majorAreasByCity = {
    'Mumbai': [
        { name: 'Bandra West', lat: 19.0596, lng: 72.8295 },
        { name: 'Chembur Industrial', lat: 19.0522, lng: 72.9005 },
        { name: 'Andheri East', lat: 19.1151, lng: 72.8750 },
        { name: 'Colaba Terminal', lat: 18.9067, lng: 72.8147 }
    ],
    'New Delhi': [
        { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
        { name: 'ITO Junction', lat: 28.6285, lng: 77.2410 },
        { name: 'Anand Vihar', lat: 28.6465, lng: 77.3023 },
        { name: 'Dwarka Hub', lat: 28.5823, lng: 77.0500 }
    ],
    'Bangalore': [
        { name: 'Whitefield IT Hub', lat: 12.9698, lng: 77.7499 },
        { name: 'Koramangala CBD', lat: 12.9352, lng: 77.6245 },
        { name: 'Electronic City', lat: 12.8468, lng: 77.6769 }
    ],
    'Hyderabad': [
        { name: 'Hitech City', lat: 17.4435, lng: 78.3773 },
        { name: 'Gachibowli Corridor', lat: 17.4401, lng: 78.3489 },
        { name: 'Banjara Hills', lat: 17.4156, lng: 78.4411 }
    ],
    'Chennai': [
        { name: 'Guindy Industrial', lat: 13.0067, lng: 80.2206 },
        { name: 'Adyar Corridor', lat: 13.0063, lng: 80.2575 },
        { name: 'T. Nagar Commercial', lat: 13.0418, lng: 80.2341 }
    ],
    'Kolkata': [
        { name: 'Salt Lake Sector V', lat: 22.5735, lng: 88.4331 },
        { name: 'Howrah Bridge Area', lat: 22.5851, lng: 88.3137 },
        { name: 'Park Street', lat: 22.5473, lng: 88.3533 }
    ],
    'Pune': [
        { name: 'Hinjewadi IT Park', lat: 18.5912, lng: 73.7389 },
        { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
        { name: 'Kothrud Residential', lat: 18.5074, lng: 73.8077 }
    ],
    'Ahmedabad': [
        { name: 'GIFT City', lat: 23.1620, lng: 72.6841 },
        { name: 'Naroda Industrial', lat: 23.0853, lng: 72.6643 },
        { name: 'Satellite Area', lat: 23.0205, lng: 72.5282 }
    ],
    'Jaipur': [
        { name: 'Malviya Nagar', lat: 26.8634, lng: 75.8010 },
        { name: 'Mansarovar', lat: 26.8534, lng: 75.7521 },
        { name: 'Vaishali Nagar', lat: 26.9124, lng: 75.7262 }
    ],
    'Lucknow': [
        { name: 'Hazratganj', lat: 26.8467, lng: 80.9462 },
        { name: 'Gomti Nagar', lat: 26.8662, lng: 81.0053 },
        { name: 'Alambagh', lat: 26.8008, lng: 80.9192 }
    ],
    'Patna': [
        { name: 'Bailey Road', lat: 25.6125, lng: 85.1101 },
        { name: 'Boring Road', lat: 25.6212, lng: 85.1089 },
        { name: 'Kankarbagh', lat: 25.5773, lng: 85.1434 }
    ],
    'Bhopal': [
        { name: 'TT Nagar', lat: 23.2406, lng: 77.4192 },
        { name: 'Habibganj', lat: 23.2316, lng: 77.4334 },
        { name: 'Bairagarh', lat: 23.2946, lng: 77.3504 }
    ],
    'Visakhapatnam': [
        { name: 'Steel Plant Area', lat: 17.6784, lng: 83.2119 },
        { name: 'Gajuwaka', lat: 17.6822, lng: 83.1989 },
        { name: 'Rushikonda', lat: 17.7801, lng: 83.3763 }
    ],
    'Kochi': [
        { name: 'Edapally Junction', lat: 10.0267, lng: 76.3094 },
        { name: 'Kakkanad', lat: 10.0100, lng: 76.3504 },
        { name: 'Fort Kochi', lat: 9.9638, lng: 76.2430 }
    ],
    'Guwahati': [
        { name: 'Dispur', lat: 26.1430, lng: 91.7898 },
        { name: 'Paltan Bazar', lat: 26.1793, lng: 91.7441 },
        { name: 'Guwahati Refinery', lat: 26.1960, lng: 91.8118 }
    ],
    'Ranchi': [
        { name: 'Doranda', lat: 23.3337, lng: 85.3011 },
        { name: 'Kanke', lat: 23.3912, lng: 85.2962 },
        { name: 'Ratu Road', lat: 23.3756, lng: 85.3046 }
    ],
    'Ludhiana': [
        { name: 'Industrial Area A', lat: 30.9255, lng: 75.8579 },
        { name: 'Shaheed Bhagat Singh Nagar', lat: 30.8982, lng: 75.8375 },
        { name: 'Focal Point', lat: 30.8763, lng: 75.8188 }
    ],
    'Gurugram': [
        { name: 'Cyber City', lat: 28.4950, lng: 77.0888 },
        { name: 'Sohna Road', lat: 28.4231, lng: 77.0468 },
        { name: 'Golf Course Extension', lat: 28.4414, lng: 77.1162 }
    ],
    'Dehradun': [
        { name: 'Rajpur Road', lat: 30.3476, lng: 78.0573 },
        { name: 'ISBT Area', lat: 30.3255, lng: 78.0421 },
        { name: 'Prem Nagar', lat: 30.3019, lng: 77.9758 }
    ],
    'Bhubaneswar': [
        { name: 'Nayapalli', lat: 20.2926, lng: 85.8214 },
        { name: 'Saheed Nagar', lat: 20.2768, lng: 85.8460 },
        { name: 'Infocity', lat: 20.3608, lng: 85.8196 }
    ],
    'Surat': [
        { name: 'Udhna', lat: 21.1621, lng: 72.8561 },
        { name: 'Katargam', lat: 21.2099, lng: 72.8496 },
        { name: 'Sachin GIDC', lat: 21.0883, lng: 72.8850 }
    ],
    'Shimla': [
        { name: 'The Ridge', lat: 31.1048, lng: 77.1734 },
        { name: 'Lakkar Bazar', lat: 31.1041, lng: 77.1688 },
        { name: 'Sanjauli', lat: 31.0922, lng: 77.1784 }
    ],
    'Panaji': [
        { name: 'Fontainhas', lat: 15.4944, lng: 73.8336 },
        { name: 'Campal', lat: 15.4967, lng: 73.8267 },
        { name: 'Miramar', lat: 15.4800, lng: 73.8047 }
    ],
    'Jammu': [
        { name: 'Gandhi Nagar', lat: 32.7178, lng: 74.8730 },
        { name: 'Bakshi Nagar', lat: 32.7219, lng: 74.8635 },
        { name: 'Trikuta Nagar', lat: 32.7437, lng: 74.8459 }
    ],
    'Imphal': [
        { name: 'Paona Bazar', lat: 24.8187, lng: 93.9363 },
        { name: 'Thangal Bazar', lat: 24.8122, lng: 93.9386 },
        { name: 'Porompat', lat: 24.8396, lng: 93.9641 }
    ],
    'Shillong': [
        { name: 'Police Bazar', lat: 25.5788, lng: 91.8933 },
        { name: 'Laban', lat: 25.5707, lng: 91.8809 },
        { name: 'Mawlai', lat: 25.5946, lng: 91.8904 }
    ],
    'Raipur': [
        { name: 'Pandri', lat: 21.2603, lng: 81.6296 },
        { name: 'Shankar Nagar', lat: 21.2561, lng: 81.6412 },
        { name: 'Telibandha', lat: 21.2436, lng: 81.6323 }
    ],
    'Agartala': [
        { name: 'Battala', lat: 23.8354, lng: 91.2908 },
        { name: 'Siddhiashram', lat: 23.8400, lng: 91.2847 },
        { name: 'Krishnanagar', lat: 23.8209, lng: 91.3017 }
    ],
    'Aizawl': [
        { name: 'Zarkawt', lat: 23.7305, lng: 92.7175 },
        { name: 'Durtlang', lat: 23.7452, lng: 92.7054 },
        { name: 'Bawngkawn', lat: 23.7165, lng: 92.7254 }
    ],
    'Gangtok': [
        { name: 'MG Marg', lat: 27.3389, lng: 88.6065 },
        { name: 'Tadong', lat: 27.3432, lng: 88.6171 },
        { name: 'Deorali', lat: 27.3188, lng: 88.6048 }
    ]
};

// ── Monitoring Station Cities ──────────────────────────────────────────
// These cities are treated as having real AQI monitoring stations.
// All other cities/areas get IDW-interpolated AQI from the nearest stations.
const stationCities = new Set([
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad',
    'Lucknow', 'Kanpur', 'Agra', 'Ghaziabad', 'Varanasi', 'Noida',
    'New Delhi', 'North Delhi', 'South Delhi',
    'Bangalore', 'Mysore', 'Hubli', 'Mangalore',
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
    'Kolkata', 'Howrah', 'Asansol', 'Siliguri',
    'Chennai', 'Coimbatore', 'Madurai',
    'Hyderabad', 'Warangal',
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota',
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur',
    'Patna', 'Gaya', 'Muzaffarpur',
    'Visakhapatnam', 'Vijayawada',
    'Ludhiana', 'Amritsar', 'Chandigarh',
    'Gurugram', 'Faridabad',
    'Kochi', 'Thiruvananthapuram', 'Kozhikode',
    'Bhubaneswar', 'Ranchi', 'Jamshedpur', 'Dhanbad',
    'Raipur', 'Guwahati', 'Dehradun', 'Shimla',
    'Panaji', 'Jammu', 'Srinagar', 'Imphal', 'Shillong',
    'Gangtok', 'Agartala', 'Aizawl', 'Kohima', 'Itanagar'
]);

// ── Haversine Distance (km) ───────────────────────────────────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Build a flat list of all station locations with their AQI ─────────
// Recomputed each call cycle to reflect live updates
function getStationAQIData() {
    const stations = [];
    for (const [stateName, cities] of Object.entries(majorCitiesByState)) {
        for (const city of cities) {
            if (stationCities.has(city.name)) {
                const stats = generateDetailedStats(city.name, 'city');
                stations.push({ name: city.name, lat: city.lat, lng: city.lng, aqi: stats.aqi });
            }
        }
    }
    return stations;
}

// ── Inverse Distance Weighting ────────────────────────────────────────
// For a location without its own station, estimate AQI from nearest K stations
// Using power p=2 so that closer stations dominate
function computeIDWAqi(lat, lng, stations, k = 3, power = 2) {
    // Compute distances to all stations
    const withDist = stations.map(s => ({
        ...s,
        dist: haversineDistance(lat, lng, s.lat, s.lng)
    }));

    // Sort by distance, take nearest K
    withDist.sort((a, b) => a.dist - b.dist);
    const nearest = withDist.slice(0, k);

    // If the closest station is < 1km away, just use its AQI directly
    if (nearest[0] && nearest[0].dist < 1) {
        return nearest[0].aqi;
    }

    // IDW: weight = 1 / dist^power
    let weightedSum = 0;
    let weightTotal = 0;
    for (const s of nearest) {
        const w = 1 / Math.pow(Math.max(s.dist, 0.1), power);
        weightedSum += w * s.aqi;
        weightTotal += w;
    }

    return Math.round(weightedSum / weightTotal);
}

// Fallback logic for smaller cities if they miss mapping
const genericAreas = ['Central Ward', 'North District', 'South Commercial', 'West Hub', 'East Residential'];

// --- Centralised ML Data Cache ---
// Ensures stats and chart components get identical data even when called at slightly different times.
let mlCache = {
    data: null,
    timestamp: 0,
    ttl: 2 * 60 * 1000 // 2 minutes
};

/**
 * @desc Helper to fetch synchronized national data with caching
 */
const fetchMLNationalData = async () => {
    const now = Date.now();
    if (mlCache.data && (now - mlCache.timestamp < mlCache.ttl)) {
        console.log('[CACHE] Using cached ML data');
        return mlCache.data;
    }

    try {
        // 1. Fetch Ground-Truth Data from API first
        const apiData = await aqiService.fetchNationalAQIData();
        
        let payload = { country: 'India' };
        if (apiData && apiData.history24h) {
            // Pass the REAL last 24h history to the ML Model
            payload.recentHistory = apiData.history24h;
            console.log('[SYNC] Passing 24h Ground-Truth to ML Model');
        }

        const mlUrl = `${process.env.ML_SERVICE_URL}/predict-country`;
        const response = await axios.post(mlUrl, payload, { timeout: 15000 });

        if (response.data) {
            // Merge API ground-truth into the ML response to ensure frontend gets latest "Actual"
            if (apiData) {
                response.data.current_live_aqi = apiData.currentAqi;
                response.data.real_history = apiData.history24h;
            }
            
            mlCache.data = response.data;
            mlCache.timestamp = now;
            console.log('[CACHE] ML Data Updated with API Sync');
            return response.data;
        }
    } catch (err) {
        console.warn('[CACHE ERROR] ML Service or API unreachable, using null:', err.message);
    }
    return mlCache.data; // Return stale if exists, or null
};

// Helper to generate deterministic simulated data for a state/city/area
const generateDetailedStats = (name, level = 'state', baseAqi = null) => {
    const today = new Date().getDate();
    const now = new Date();
    // Unique seed for level to vary data
    const levelSeed = level === 'state' ? 17 : level === 'city' ? 23 : 31;
    // Use minutes in seed to ensure data changes every minute
    const seed = name.length * (today + now.getHours() * 60 + now.getMinutes()) * levelSeed;

    // Dynamic Jitter (±15) that varies Every 10 Seconds (quantized) to ensure it feels live
    const quantizedTime = Math.floor(now.getTime() / 10000);
    const jitter = Math.sin(quantizedTime) * 15;

    // Use baseAqi if provided to anchor simulation to reality, else fallback to seed-based
    let anchor = baseAqi || (seed % 200) + 50; 
    
    // Deviance based on seed (-30% to +50% of anchor)
    const factor = 1 + ((seed % 100) - 40) / 100;
    let aqi = Math.round((anchor * factor) + jitter);
    aqi = Math.max(20, aqi); // Ensure floor

    // Predict 6-Hour trend peak based on current volatility
    const cycle = Math.sin((now.getHours() + 6) * Math.PI / 12);
    let expectedAqi = Math.round(aqi * (1 + (cycle * 0.15) + ((seed % 10) / 100)));
    expectedAqi = Math.max(20, expectedAqi);

    let status = 'Moderate';
    if (aqi > 250) status = 'Severe';
    else if (aqi > 200) status = 'Very Poor';
    else if (aqi > 150) status = 'Poor';
    else if (aqi <= 70) status = 'Good';

    // Simulated reasoning based on name length odd/even + level
    const isEven = name.length % 2 === 0;
    let source = isEven ? 'Vehicular Traffic' : 'Industrial Emissions';
    if (name.includes('Industrial')) source = 'Industrial Emissions';
    if (name.includes('Transit')) source = 'Vehicular Traffic';
    if (name.includes('Terminal')) source = 'Construction Dust';
    if (name.includes('Punjab') || name.includes('Haryana')) source = 'Biomass Burning';

    const reason = level === 'state'
        ? `Regional ${source.toLowerCase()} detected across primary transport and industrial corridors.`
        : level === 'city'
            ? `High concentration of ${source.toLowerCase()} in urban density clusters and infrastructure zones.`
            : `Localized hotspot caused by ${source.toLowerCase()} trapping pollutants in this specific micro-grid.`;

    const action = isEven
        ? 'Implement localized emission caps and optimize traffic flow during peak hours.'
        : 'Deploy anti-smog units and enforcement teams to high-impact sectors.';

    return { 
        aqi, 
        expectedAqi,
        status, 
        source, 
        reason, 
        action,
        // New pollutant data (Simulated based on AQI level)
        pm2_5: Math.round(aqi * 0.6),
        pm10: Math.round(aqi * 0.9),
        no2: Math.round(20 + (aqi / 10)),
        so2: Math.round(10 + (aqi / 15)),
        co2: Math.round(400 + (aqi / 2)), // Simulated CO2 in ppm
        windSpeed: Math.round(5 + (seed % 15)),
        windDir: (seed % 360) 
    };
};

/**
 * @desc    Get aggregated dashboard stats for admin
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res, next) => {
    try {
        let totalAqi = 0;
        let redZones = 0;
        const now = new Date();

        let worstState = majorStates[0];
        let maxAqi = 0;

        // Simulate state data with minute-level jitter to avoid static feel
        const minJitter = Math.sin(now.getMinutes() * Math.PI / 30) * 5;

        // Fetch REAL National AQI first to use as anchor
        const mlData = await fetchMLNationalData();
        let referenceAqi = 65; // Default fallback (aligned with chart)
        if (mlData && mlData.current_live_aqi) referenceAqi = mlData.current_live_aqi;

        majorStates.forEach((state) => {
            const stats = generateDetailedStats(state.name, 'state', referenceAqi);
            const jitteredAqi = Math.round(stats.aqi + minJitter);

            if (jitteredAqi > maxAqi) {
                maxAqi = jitteredAqi;
                worstState = state;
            }

            totalAqi += jitteredAqi;
            if (jitteredAqi > 150) {
                redZones++;
            }
        });

        // 1. Fetch REAL National Live AQI from ML Service (via shared cache)
        let simulatedNationalAvg = Math.round(totalAqi / majorStates.length);
        let nationalAqi = simulatedNationalAvg;

        if (mlData && mlData.current_live_aqi) {
            nationalAqi = Math.round(mlData.current_live_aqi);
        } else {
            // Fallback synchronized simulation
            // Standardized base 65 to match chart
            const simulationBase = 65;
            nationalAqi = Math.round(simulationBase + (now.getMinutes() % 10));
        }

        const expectedAqi = Math.round(nationalAqi * 0.9);

        // Calculate varied source percentages (with live jitter)
        const dateSeed = now.getDate() + now.getHours(); // Base hourly variation
        const sourceJitter = Math.floor(now.getTime() / 10000) % 5; // 0-4 variation every 10s
        
        let sources = [
            { name: 'Vehicular Traffic', value: 35 + (dateSeed % 15) + (sourceJitter === 0 ? 2 : -1) },
            { name: 'Construction Dust', value: 20 + (dateSeed % 10) + (sourceJitter === 1 ? 3 : -1) },
            { name: 'Industrial Emissions', value: 25 + ((dateSeed * 2) % 12) + (sourceJitter === 2 ? 2 : -1) },
            { name: 'Biomass Burning', value: 10 + ((dateSeed * 3) % 8) + (sourceJitter === 3 ? 1 : 0) }
        ];

        const totalSources = sources.reduce((acc, curr) => acc + curr.value, 0);
        sources = sources.map(s => ({
            name: s.name,
            percentage: Math.round((Math.max(1, s.value) / totalSources) * 100)
        })).sort((a, b) => b.percentage - a.percentage);

        const stateDataPayload = [
            { name: worstState.name, aqi: maxAqi, source: sources[0].name }
        ];

        let aiRecommendations = await aiPredictionService.generateStateRecommendations(stateDataPayload);

        if (!aiRecommendations || aiRecommendations.length === 0) {
            const activeAlerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 }).limit(1);

            if (activeAlerts.length > 0) {
                aiRecommendations = activeAlerts.map(a => ({
                    id: a._id.toString(),
                    title: `${a.level} Alert: ${a.ward}`,
                    description: a.message,
                    time: 'Live',
                    type: a.level.toLowerCase()
                }));
            } else {
                const worstStats = generateDetailedStats(worstState.name, 'state');
                aiRecommendations = [{
                    id: `fallback-${worstState.name.toLowerCase()}`,
                    title: `${worstStats.status} Alert: ${worstState.name}`,
                    description: `AQI in ${worstState.name} reached ${maxAqi}. ${worstStats.reason} ${worstStats.action}`,
                    time: 'Live',
                    type: maxAqi > 150 ? 'severe' : 'moderate'
                }];
            }
        }

        res.setHeader('X-Stats-Version', 'Live-V5-Pulsed');
        res.json({
            nationalAqi,
            redZones,
            primarySource: sources[0].name,
            sources: sources,
            prediction24h: 'Improving',
            expectedAqi,
            activeAlerts: aiRecommendations,
            lastUpdated: now.toISOString(),
            isLive: true
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get aggregated chart data for admin
 * @route   GET /api/admin/chart
 * @access  Private/Admin
 */
const getDashboardChartData = async (req, res, next) => {
    try {
        const now = new Date();
        const currentHourStart = new Date(now);
        currentHourStart.setMinutes(0, 0, 0, 0);

        // We want the last 24 COMPLETED hours for a stable ML model input
        const stable24hStart = new Date(currentHourStart.getTime() - 24 * 60 * 60 * 1000);

        // 1. Fetch exactly 24 stable hourly points
        let history = await WardHourly.aggregate([
            { $match: { timestamp: { $gte: stable24hStart, $lt: currentHourStart } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%H:00", date: "$timestamp" } },
                    actual: { $avg: "$avgAqi" },
                    timestamp: { $first: "$timestamp" }
                }
            },
            { $sort: { timestamp: 1 } }
        ]);

        // Scenario: Empty DB - Simulation or API Fallback
        if (history.length < 24) {
            // Priority 1: Use Ground-Truth API for history if DB empty
            const apiData = await aqiService.fetchNationalAQIData();
            
            if (apiData && apiData.history24h && apiData.history24h.length >= 24) {
                history = apiData.history24h.map((val, idx) => {
                    const pastTime = new Date(currentHourStart.getTime() - (24 - idx) * 60 * 60 * 1000);
                    return {
                        _id: `${pastTime.getHours().toString().padStart(2, '0')}:00`,
                        actual: val,
                        timestamp: pastTime
                    };
                });
            } else {
                // Priority 2: Realistic Simulation
                let baseAqi = 65; 
                const simulatedHistory = [];
                for (let i = 24; i >= 1; i--) {
                const pastTime = new Date(currentHourStart.getTime() - i * 60 * 60 * 1000);
                const h = pastTime.getHours();
                const cycle = Math.sin((h - 6) * Math.PI / 12) * 10;
                baseAqi = Math.max(30, Math.min(250, baseAqi + cycle * 0.05 + (i % 2)));
                simulatedHistory.push({
                    _id: `${pastTime.getHours().toString().padStart(2, '0')}:00`,
                    actual: Math.round(baseAqi),
                    timestamp: pastTime
                });
            }
            history = simulatedHistory.slice(-24);
        }
    }

        // 2. Build THE SKELETON
        let chartData = [];
        let baselineAqi = history[history.length - 1]?.actual || 65;

        // A. Past 6 hours
        for (let i = -6; i <= -1; i++) {
            const timePoint = new Date(currentHourStart.getTime() + i * 60 * 60 * 1000);
            const label = `${timePoint.getHours().toString().padStart(2, '0')}:00`;
            const hist = history.find(h => h._id === label);
            chartData.push({
                time: label,
                actual: hist ? Math.round(hist.actual) : Math.round(baselineAqi),
                predicted: null,
                isFuture: false
            });
        }

        // B. The Bridge Point
        const currentHourLabel = `${currentHourStart.getHours().toString().padStart(2, '0')}:00`;
        chartData.push({
            time: currentHourLabel,
            actual: Math.round(baselineAqi),
            predicted: null,
            isFuture: false
        });

        // C. (REMOVED Intermediate Growth & Live Tip per User Request)

        for (let i = 1; i <= 6; i++) {
            const timePoint = new Date(currentHourStart.getTime() + i * 60 * 60 * 1000);
            const label = `${timePoint.getHours().toString().padStart(2, '0')}:00`;
            chartData.push({
                time: label,
                actual: null,
                predicted: null,
                isFuture: true
            });
        }

        // 4. ML Forecast + REAL LIVE DATA
        let mlForecastRaw = [];
        let realLiveAqi = null;
        let realHistoryAqi = null;

        const mlData = await fetchMLNationalData();
        if (mlData) {
            if (mlData.forecast) mlForecastRaw = mlData.forecast.map(f => f.predicted_aqi);
            if (mlData.current_live_aqi) realLiveAqi = mlData.current_live_aqi;
            if (mlData.data_source === "Open-Meteo Real-time API") realHistoryAqi = mlData.real_history || null;
        }

        if (realHistoryAqi && realHistoryAqi.length >= 7) {
            for (let i = 0; i <= 6; i++) {
                const apiIdx = realHistoryAqi.length - 7 + i;
                const val = realHistoryAqi[apiIdx];
                if (val !== undefined && val !== null && !isNaN(val)) {
                    chartData[i].actual = Math.round(val);
                }
            }
        }

        // Apply Real Live Data
        // Anchor for predictions is the last historical point (Current Hour Start)
        const anchorIdx = 6;

        // Assigned AFTER history loop so live data doesn't get overwritten by historical average
        if (realLiveAqi !== null && realLiveAqi !== undefined && !isNaN(realLiveAqi)) {
            chartData[anchorIdx].actual = Math.round(realLiveAqi);
        } else {
            const statsBaseline = 65;
            chartData[anchorIdx].actual = Math.round(statsBaseline + (now.getMinutes() % 10));
        }

        const verifiedLastActual = chartData[anchorIdx].actual || 65;

        if (mlForecastRaw.length >= 6) {
            let forecastIdx = 0;
            const anchorPoint = chartData[anchorIdx];
            const anchorValue = anchorPoint.actual;
            
            // Calculate initial bias at the anchor point to smooth transition
            // If the model says T+1 is 120 but anchor is 150, bias is 30.
            const rawT1 = mlForecastRaw[0];
            const bias = anchorValue - rawT1;

            chartData.forEach((d, idx) => {
                if (idx === anchorIdx) {
                    // This is our anchor where the lines meet
                    d.predicted = d.actual;
                } else if (d.isFuture) {
                    const rawVal = typeof mlForecastRaw[forecastIdx] === 'number' ? mlForecastRaw[forecastIdx] : verifiedLastActual;
                    // Apply decaying bias: 100%, 80%, 60%, 40%, 20%, 0%
                    const decayFactor = Math.max(0, (6 - forecastIdx) / 6);
                    let predictedValue = Math.round(rawVal + (bias * decayFactor));
                    
                    d.predicted = Math.max(0, predictedValue);
                    d.actual = null; // Ensure no actual line in future
                    forecastIdx++;
                } else {
                    // Past data should NOT show predicted values to avoid overlap
                    d.predicted = null;
                }
            });
        } else {
            chartData.forEach((d, idx) => {
                if (idx === anchorIdx) {
                    d.predicted = d.actual;
                } else if (d.isFuture) {
                    const offset = chartData.filter(x => x.isFuture).indexOf(d) + 1;
                    let predictedValue = verifiedLastActual + (offset * 2);
                    d.predicted = Math.max(0, predictedValue);
                    d.actual = null;
                } else {
                    d.predicted = null;
                }
            });
        }

        res.setHeader('X-Debug-Source', 'AdminController-V4');
        res.json(chartData);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get national hotspots for map
 * @route   GET /api/admin/national-hotspots
 * @access  Private/Admin
 */
const getNationalHotspots = async (req, res, next) => {
    try {
        const { level = 'state', state: stateName, city: cityName } = req.query;
        const mlData = await fetchMLNationalData();
        const baseAqi = (mlData && mlData.current_live_aqi) ? mlData.current_live_aqi : 65;

        let data = [];

        if (level === 'state') {
            // Return ALL states for national view
            data = majorStates.map(state => {
                const stats = generateDetailedStats(state.name, 'state', baseAqi);
                return {
                    id: `state-${state.name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: state.name,
                    lat: state.lat,
                    lng: state.lng,
                    ...stats
                };
            });
        } else if (level === 'city' && stateName) {
            let cities = majorCitiesByState[stateName];
            if (!cities || cities.length === 0) {
                const st = majorStates.find(s => s.name === stateName);
                if (st) {
                    cities = [
                        { name: stateName + ' Capital', lat: st.lat, lng: st.lng },
                        { name: stateName + ' North', lat: st.lat + 0.5, lng: st.lng },
                        { name: stateName + ' South', lat: st.lat - 0.5, lng: st.lng },
                        { name: stateName + ' East', lat: st.lat, lng: st.lng + 0.5 },
                        { name: stateName + ' West', lat: st.lat, lng: st.lng - 0.5 }
                    ];
                } else {
                    cities = [];
                }
            }
            // Build station AQI data for IDW interpolation
            const stations = getStationAQIData();

            data = cities.map(city => {
                let stats;
                if (stationCities.has(city.name)) {
                    // Station city: use its own generated AQI
                    stats = generateDetailedStats(city.name, 'city', baseAqi);
                    stats.hasStation = true;
                } else {
                    // Non-station city: IDW interpolation from nearest stations
                    const idwAqi = computeIDWAqi(city.lat, city.lng, stations);
                    stats = generateDetailedStats(city.name, 'city', idwAqi);
                    stats.aqi = idwAqi; // Override with precise IDW value
                    stats.hasStation = false;
                    // Recalculate status based on IDW AQI
                    if (idwAqi > 250) stats.status = 'Severe';
                    else if (idwAqi > 200) stats.status = 'Very Poor';
                    else if (idwAqi > 150) stats.status = 'Poor';
                    else if (idwAqi > 100) stats.status = 'Moderate';
                    else if (idwAqi <= 70) stats.status = 'Good';
                    else stats.status = 'Moderate';
                    // Recalculate pollutant data based on IDW AQI
                    stats.pm2_5 = Math.round(idwAqi * 0.6);
                    stats.pm10 = Math.round(idwAqi * 0.9);
                    stats.no2 = Math.round(20 + (idwAqi / 10));
                    stats.so2 = Math.round(10 + (idwAqi / 15));
                    stats.co2 = Math.round(400 + (idwAqi / 2));
                }
                return {
                    id: `city-${city.name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: city.name,
                    lat: city.lat,
                    lng: city.lng,
                    ...stats
                };
            });
        } else if (level === 'area' && cityName) {
            let areas = majorAreasByCity[cityName];
            if (!areas || areas.length === 0) {
                let cLat = 22.0, cLng = 78.0;
                let foundCity = false;
                for (const stateList of Object.values(majorCitiesByState)) {
                    const c = stateList.find(city => city.name === cityName);
                    if (c) { cLat = c.lat; cLng = c.lng; foundCity = true; break; }
                }
                
                if (!foundCity) {
                    for (const s of majorStates) {
                        if (cityName.includes(s.name)) {
                            cLat = s.lat; cLng = s.lng; break;
                        }
                    }
                }

                areas = [
                    { name: cityName + ' Downtown', lat: cLat, lng: cLng },
                    { name: cityName + ' Industrial Zone', lat: cLat + 0.02, lng: cLng + 0.02 },
                    { name: cityName + ' Residential Complex', lat: cLat - 0.02, lng: cLng - 0.02 },
                    { name: cityName + ' Tech Park', lat: cLat + 0.02, lng: cLng - 0.02 },
                ];
            }
            // Build station AQI data for IDW interpolation
            const stations = getStationAQIData();

            data = areas.map(area => {
                // All areas use IDW from nearest stations for smooth variation
                const idwAqi = computeIDWAqi(area.lat, area.lng, stations);
                const stats = generateDetailedStats(area.name, 'area', idwAqi);
                stats.aqi = idwAqi;
                // Recalculate status
                if (idwAqi > 250) stats.status = 'Severe';
                else if (idwAqi > 200) stats.status = 'Very Poor';
                else if (idwAqi > 150) stats.status = 'Poor';
                else if (idwAqi > 100) stats.status = 'Moderate';
                else if (idwAqi <= 70) stats.status = 'Good';
                else stats.status = 'Moderate';
                // Recalculate pollutants
                stats.pm2_5 = Math.round(idwAqi * 0.6);
                stats.pm10 = Math.round(idwAqi * 0.9);
                stats.no2 = Math.round(20 + (idwAqi / 10));
                stats.so2 = Math.round(10 + (idwAqi / 15));
                stats.co2 = Math.round(400 + (idwAqi / 2));

                return {
                    id: `area-${area.name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: area.name,
                    lat: area.lat,
                    lng: area.lng,
                    ...stats
                };
            });
        }

        res.json(data);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all detailed alerts (Hierarchical State -> City -> Ward)
 * @route   GET /api/admin/detailed-alerts
 * @access  Private/Admin
 */
const getDetailedAlerts = async (req, res, next) => {
    try {
        const mlData = await fetchMLNationalData();
        const baseAqi = (mlData && mlData.current_live_aqi) ? mlData.current_live_aqi : 65;

        const hierarchicalData = majorStates.map(state => {
            const stateCities = majorCitiesByState[state.name] || [];
            const citiesData = stateCities.map(cityObj => {
                const cityName = cityObj.name;
                const cityStats = generateDetailedStats(cityName, 'city', baseAqi);
                const cityAreas = majorAreasByCity[cityName] || genericAreas;
                const wardsData = cityAreas.map(area => {
                    const areaName = typeof area === 'string' ? area : area.name;
                    const stats = generateDetailedStats(areaName, 'area', cityStats.aqi);
                    return {
                        id: `ward-${areaName.toLowerCase().replace(/\s+/g, '-')}`,
                        name: areaName,
                        aqi: stats.aqi,
                        status: stats.status,
                        source: stats.source,
                        reason: stats.reason,
                        action: stats.action
                    };
                });

                return {
                    id: `city-${cityName.toLowerCase()}`,
                    name: cityName,
                    cityAqi: cityStats.aqi,
                    status: cityStats.status,
                    source: cityStats.source,
                    reason: cityStats.reason,
                    action: cityStats.action,
                    wards: wardsData
                };
            });

            const stateStats = generateDetailedStats(state.name, 'state', baseAqi);
            return {
                id: `state-${state.name.toLowerCase().replace(/\s+/g, '-')}`,
                name: state.name,
                overallAqi: stateStats.aqi,
                status: stateStats.status,
                source: stateStats.source,
                reason: stateStats.reason,
                action: stateStats.action,
                cities: citiesData
            };
        });

        const filteredData = hierarchicalData.filter(state => state.status !== 'Good');

        res.json(filteredData.sort((a, b) => b.overallAqi - a.overallAqi));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get hierarchical detailed predictions (State -> City -> Area)
 * @route   GET /api/admin/detailed-predictions
 * @access  Private/Admin
 */
const getDetailedPredictions = async (req, res, next) => {
    try {
        const mlData = await fetchMLNationalData();
        const referenceAqi = (mlData && mlData.current_live_aqi) ? mlData.current_live_aqi : 65;

        const hierarchicalData = Object.keys(majorCitiesByState).map(stateName => {
            const citiesData = majorCitiesByState[stateName].map(cityObj => {
                const cityName = cityObj.name;
                const cityStats = generateDetailedStats(cityName, 'city', referenceAqi);
                const areas = majorAreasByCity[cityName] || genericAreas;

                const areasData = areas.map(area => {
                    const areaName = typeof area === 'string' ? area : area.name;
                    const stats = generateDetailedStats(areaName, 'area', cityStats.aqi);
                    
                    const predictionData = [];
                    for (let i = 1; i <= 6; i++) {
                        predictionData.push({
                            time: `+${i}h`,
                            predicted: Math.round(stats.aqi + (Math.sin(i) * 10) + (i * 2))
                        });
                    }

                    return {
                        area: areaName,
                        currentAqi: stats.aqi,
                        predictionData: predictionData
                    };
                });

                return {
                    city: cityName,
                    areas: areasData
                };
            });

            return {
                state: stateName,
                cities: citiesData
            };
        });

        res.json(hierarchicalData);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Dispatch emergency alert/broadcast
 * @route   POST /api/admin/dispatch-alert
 * @access  Private/Admin
 */
const dispatchAlert = async (req, res, next) => {
    try {
        const { state, aqi, message } = req.body;
        const stats = generateDetailedStats(state, 'state');
        const alertMessage = message || `High pollution alert for ${state}. Current AQI is ${aqi}. ${stats.reason} Requested Action: ${stats.action}`;
        
        const alert = new Alert({
            ward: state,
            level: aqi > 200 ? 'Severe' : aqi > 150 ? 'High' : 'Moderate',
            message: alertMessage,
            type: 'SYSTEM',
            isActive: true
        });

        await alert.save();
        res.status(201).json({
            success: true,
            message: 'Broadcast alert dispatched successfully',
            alert
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get model accuracy metrics (MAE, MSE, RMSE)
 * @route   GET /api/admin/accuracy-metrics
 * @access  Private/Admin
 */
const getModelAccuracyMetrics = async (req, res, next) => {
    try {
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5002';
        const response = await fetch(`${ML_SERVICE_URL}/ml/accuracy-metrics`);
        const metrics = await response.json();
        
        if (!response.ok) {
            throw new Error(metrics.error || 'Failed to fetch model accuracy metrics');
        }
        
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching model metrics:', error);
        // Fallback for UI stability
        res.json({
            mae: 4.82,
            mse: 31.45,
            rmse: 5.61,
            samples: 24,
            model_type: "LSTM (Fallback)",
            isFallback: true
        });
    }
};

module.exports = {
    getDashboardStats,
    getDashboardChartData,
    getNationalHotspots,
    getDetailedAlerts,
    getDetailedPredictions,
    getModelAccuracyMetrics,
    dispatchAlert
};
