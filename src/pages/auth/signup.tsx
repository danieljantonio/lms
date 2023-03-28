import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { signIn } from 'next-auth/react';
import React, { FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '../../lib/trpc';
import { useRouter } from 'next/router';

export type SignUpDto = {
	name: string;
	username: string;
	password: string;
};

const SignInPage = () => {
	const { register, handleSubmit } = useForm<SignUpDto>();
	const router = useRouter();

	const createUser = trpc.auth.createUser.useMutation({
		onSuccess: () => router.push('/auth/signin'),
	});

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		createUser.mutate(data);
	});

	return (
		<div className="container mx-auto">
			<form className="form-control" onSubmit={onSubmit}>
				<div className="w-fit mx-auto space-y-2">
					<div>
						<label className="label">
							<span className="label-text">Your Name</span>
						</label>
						<label className="input-group">
							<span>Name</span>
							<input
								type="text"
								placeholder="Joe Widoe"
								className="input input-bordered"
								{...register('name')}
							/>
						</label>
					</div>
					<div>
						<label className="label">
							<span className="label-text">Your Email</span>
						</label>
						<label className="input-group">
							<span>Username</span>
							<input
								type="text"
								placeholder="joewideo"
								className="input input-bordered"
								{...register('username')}
							/>
						</label>
					</div>
					<div>
						<label className="label">
							<span className="label-text">Your Password</span>
						</label>
						<label className="input-group">
							<span>Password</span>
							<input
								type="password"
								placeholder="********"
								className="input input-bordered"
								{...register('password')}
							/>
						</label>
					</div>
					<div>
						<button type="submit" className="btn mt-2">
							Sign Up
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SignInPage;
