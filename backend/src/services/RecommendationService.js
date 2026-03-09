class RecommendationService {
    getRecommendations(aqi, primaryPollutant) {
        const recommendations = {
            health: '',
            policy: '',
            color: ''
        };

        if (aqi <= 50) {
            recommendations.health = 'Air quality is satisfactory. Enjoy outdoor activities.';
            recommendations.policy = 'Maintain existing green zones.';
            recommendations.color = '#00e400';
        } else if (aqi <= 100) {
            recommendations.health = 'Sensitive individuals should limit prolonged outdoor exertion.';
            recommendations.policy = 'Optimize traffic signals in high-density wards.';
            recommendations.color = '#ffff00';
        } else if (aqi <= 200) {
            recommendations.health = 'Everyone should limit outdoor exertion. Wear N95 masks.';
            recommendations.policy = 'Implement GRAP Phase I: Ban construction dust, control biomass burning.';
            recommendations.color = '#ff7e00';
        } else if (aqi <= 300) {
            recommendations.health = 'Avoid outdoor activities. Use air purifiers indoors.';
            recommendations.policy = 'Implement GRAP Phase II: Restrict diesel generator sets.';
            recommendations.color = '#ff0000';
        } else {
            recommendations.health = 'Emergency condition. Stay indoors. Health alert for everyone.';
            recommendations.policy = 'Implement GRAP Phase III/IV: Odd-even vehicle scheme, stop construction.';
            recommendations.color = '#7e0023';
        }

        return recommendations;
    }
}

module.exports = new RecommendationService();
