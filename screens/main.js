import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { description, title } from './src/constant';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { useNavigation } from '@react-navigation/native';

const Main = () => {
	const [dailySteps, setDailySteps] = useState(0);
	const [dailyDistance, setDailyDistance] = useState(0);
	const [dailyCalories, setDailyCalories] = useState(0);
	const [dailySleep, setDailySleep] = useState(0);
	const [totoalactiveTime, setTotalActiveTime] = useState(0);

	const navigation = useNavigation();

	const options = {
		scopes: [
			Scopes.FITNESS_ACTIVITY_READ,
			Scopes.FITNESS_BODY_READ,
			Scopes.FITNESS_NUTRITION_READ,
			Scopes.FITNESS_SLEEP_READ,
			Scopes.FITNESS_HEART_RATE_READ,
		],
	};

	const HealthData = {
		dailySteps: dailySteps,
		dailyDistance: dailyDistance,
		dailyCalories: dailyCalories,
		dailySleep: dailySleep,
		totoalactiveTime: totoalactiveTime,
	};

	const fetchDailySteps = async () => {
		const res = await GoogleFit.getDailySteps(new Date());
		console.log('daily steps', res);
		var steps = 0;
		for (let i = 0; i < res.length; i++) {
			if (res[i].steps[0] && res[i].steps[0].value) {
				console.log('steps', res[i].steps[0].value);
				steps += res[i].steps[0].value;
			}
		}
		HealthData.dailySteps = steps;
		setDailySteps(steps);
	};

	const fetchDailyDistance = async (opt) => {
		const res = await GoogleFit.getDailyDistanceSamples(opt);
		console.log('daily distance', res);
		var distance = 0;
		for (let i = 0; i < res.length; i++) {
			if (res[i].distance) {
				console.log('distance', res[i].distance);
				distance += res[i].distance;
			}
		}
		HealthData.dailyDistance = distance;
		setDailyDistance(distance);
	};

	const fetchDailyCalories = async (opt) => {
		const res = await GoogleFit.getDailyCalorieSamples(opt);
		console.log('daily cal', res);
		var cals = 0;
		for (let i = 0; i < res.length; i++) {
			if (res[i].calorie) {
				console.log('cals', res[i].calorie);
				cals += res[i].calorie;
			}
		}
		HealthData.dailyCalories = cals;
		console.log('daily calorie', res);
		setDailyCalories(cals);
	};


	const fetchDailySleep = async (opt) => {
		const res = await GoogleFit.getSleepSamples(opt);
		HealthData.dailySleep = res;
		console.log('daily sleep', res);
		setDailySleep(res);
	};

	const fetchTotalActiveTime = async (opt) => {
		const res = await GoogleFit.getMoveMinutes(opt);
		var activeTime = 0;
		for (let i = 0; i < res.length; i++) {
			if (res[i].duration) {
				console.log('time', res[i].duration);
				activeTime += res[i].duration;
			}
		}
		HealthData.totoalactiveTime = activeTime;
		setTotalActiveTime(activeTime);
	};

	const onSubmit = () => {
		console.log('On Submit')
		GoogleFit.checkIsAuthorized().then(() => {
			const authorized = GoogleFit.isAuthorized;
			if (authorized) {
				getHealthData();
				navigation.navigate('Insights', {
					healthData: HealthData,
				});
			} else {
				GoogleFit.authorize(options)
					.then((res) => {
						getHealthData();
					})
					.catch((err) => {
						console.log(err);
					});
			}
		})
	};
	const getHealthData = async () => {
		console.log('Get Health Data');
		const today = new Date();
		const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
		const opt = {
			startDate: startDate.toISOString(),
			endDate: today.toISOString(),
		};
		fetchDailySteps();
		fetchDailyDistance(opt);
		fetchDailyCalories(opt);
		fetchDailySleep(opt);
		fetchTotalActiveTime(opt);
	};

	const UsedFor = ({ description }) => {
		return (
			<View className='ml-2 flex space-x-2 flex-row items-center'>
				<View className='h-2 w-2 bg-black rounded-full' />
				<Text className='text-lg'>{description}</Text>
			</View>
		);
	}

	return (
		<View className='bg-white flex-1 justify-center items-start gap-5 px-5'>
			<Text className='text-4xl font-bold'>{title}</Text>
			<Text className='text-lg mb-50'>{description}</Text>
			<View>
				<Text className='text-lg'>This data will be used for:</Text>
				<UsedFor description='Visualizations' />
				<UsedFor description='Progress tracking' />
				<UsedFor description='Personalized recommendations within the app.' />
			</View>
			<Text className='text-lg'>Enable access to your health data now.</Text>
			<View className='flex justify-center w-full items-center'>
				<Pressable className='bg-blue-500 text-white py-2 px-4 rounded' onPress={onSubmit}>
					<Text className='text-white'>Go to Permissions</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default Main;
