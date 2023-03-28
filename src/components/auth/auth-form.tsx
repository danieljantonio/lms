import { UseFormRegister, useForm } from 'react-hook-form';
import { FC, HTMLInputTypeAttribute, useState } from 'react';
import { trpc } from '../../lib/trpc';
import { signIn } from 'next-auth/react';

export type AuthDto = {
	name?: string;
	username: string;
	password: string;
};

const AuthForm: FC = () => {
	// use this to toggle between sign in or sign up
	const [action, setAction] = useState<'signin' | 'signup'>('signin');
	const { register, handleSubmit } = useForm<AuthDto>();

	const createUser = trpc.auth.createUser.useMutation({
		onSuccess: () => setAction('signin'),
	});

	const onAuth = handleSubmit((data) => {
		if (action === 'signin') {
			signIn('credentials', {
				username: data.username,
				password: data.password,
				callbackUrl: '/app',
			});
		}
		if (action === 'signup') {
			createUser.mutate(data);
		}
	});

	const placeholders = {
		signin: {
			title: 'Sign In',
			not: (
				<p className="text-sm mt-1">
					Don't have an account? Sign up{' '}
					<a
						onClick={() => setAction('signup')}
						className="link link-primary hover:text-white">
						here
					</a>
				</p>
			),
		},
		signup: {
			title: 'Sign Up',
			not: (
				<p className="text-sm mt-1">
					Have an account? Sign in{' '}
					<a
						onClick={() => setAction('signin')}
						className="link link-primary hover:text-white">
						here
					</a>
				</p>
			),
		},
	};

	return (
		<div className="p-2">
			<div className="card bg-base-300 max-w-sm mx-auto sm:mx-0">
				<div className="card-body">
					<form onSubmit={onAuth} className="form-control space-y-2">
						<h2 className="card-title">
							{placeholders[action].title}
						</h2>
						{action === 'signup' && (
							<FormItem
								field="name"
								placeholder="Joe Widodo"
								register={register}
							/>
						)}
						<FormItem
							field="username"
							placeholder="joe.widodo"
							register={register}
						/>
						<FormItem
							field="password"
							placeholder="Joe Widodo"
							type="password"
							register={register}
						/>
						{placeholders[action].not}
						<div className="card-actions justify-end">
							<button
								type="submit"
								className="btn btn-primary btn-md">
								{placeholders[action].title}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

type FormItemProps = {
	field: 'name' | 'username' | 'password';
	placeholder: string;
	type?: HTMLInputTypeAttribute;
	register: UseFormRegister<AuthDto>;
};

const FormItem: FC<FormItemProps> = ({
	register,
	field,
	type = 'text',
	placeholder,
}) => {
	return (
		<div className="form-control w-full">
			<label className="label pl-0">
				<span className="label-text">Your {field}:</span>
			</label>
			<input
				type={type}
				placeholder={placeholder}
				className="input input-bordered w-full"
				{...register(field)}
			/>
		</div>
	);
};

export default AuthForm;
