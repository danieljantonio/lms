import { useRouter } from 'next/router';

export const useCustomRoute = () => {
	const router = useRouter();
	const _path = router.pathname.split('/')[1];

	let basePath = '/';
	switch (_path) {
		case 'admin':
			basePath = '/admin';
			break;
		case 'teacher':
			basePath = '/teacher';
			break;
		case 'app':
			basePath = '/app';
			break;
		default:
			break;
	}

	const getNewRoute = (route: string) => {
		return `${basePath}/${route}`;
	};

	return { basePath, getNewRoute };
};
