import React, { useEffect } from "react";
import { Pressable, View, Text } from "react-native";

const Insights = ({ route }) => {
	const { healthData } = route.params;
	console.log("steps", healthData.dailySteps);
	useEffect(() => {
		console.log("active time", healthData.totoalactiveTime[0]);
	}, []);
	const length = healthData.dailySteps.length - 1;
	const _healthData = [
		{ title: "My Steps", value: healthData.dailySteps ? healthData.dailySteps : 0, tag: "steps/day" },
		{ title: "Distance", value: healthData.dailyDistance ? healthData.dailyDistance : 0, tag: "km/day" },
		{ title: "Time In Bed", value: healthData.dailySleep[length] ? healthData.dailySleep[length].value : 0, tag: "hours/day" },
		{ title: "Calories Burned", value: healthData.dailyCalories ? parseInt(healthData.dailyCalories) : 0, tag: "calories/day" },
		{ title: "Total Activity", value: healthData.totoalactiveTime ? healthData.totoalactiveTime : 0, tag: "minutes/day" },
	];

	const HealthDataItem = ({ title, value, tag }) => (
		<View className='flex flex-col items-start rounded-md mt-5 w-full p-3 bg-[#333333]'>
			<Text className='text-lg text-white font-bold'>{title}</Text>
			<View className='flex flex-col items-center justify-between w-full'>
				<Text className='text-2xl font-bold text-sky-600'>{value}</Text>
				<Text className='text-lg text-sky-600'>{tag}</Text>
			</View>
		</View>
	);

	return (
		<View className='p-5 h-full bg-[#d9d9d9]'>
			<Text className='text-2xl text-sky-600 font-bold'>Health Insights</Text>
			<View className='flex flex-col items-center mt-5 h-4/5 justify-between'>
				{_healthData.map((item) => (
					<HealthDataItem key={item.title} title={item.title} value={item.value} tag={item.tag} />
				))}
			</View>
		</View>
	);
};

export default Insights;