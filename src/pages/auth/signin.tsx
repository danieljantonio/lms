import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { signIn, signOut } from 'next-auth/react';
import React, { FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';

export type SignInDto = {
	username: string;
	password: string;
};

const SignInPage = () => {
	const { register, handleSubmit } = useForm<SignInDto>();

	const onSubmit = handleSubmit((data) => {
		console.log(data);

		signIn('credentials', {
			username: data.username,
			password: data.password,
			redirect: false,
		});
	});

	return (
		<div className="container mx-auto">
			<form className="form-control" onSubmit={onSubmit}>
				<div className="w-fit mx-auto">
					<label className="label">
						<span className="label-text">Your Email</span>
					</label>
					<label className="input-group">
						<span>Username</span>
						<input
							type="text"
							placeholder="info@site.com"
							className="input input-bordered"
							{...register('username')}
						/>
					</label>
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
					<button type="submit" className="btn">
						Sign In
					</button>
				</div>
			</form>
			<button className="btn" onClick={() => signOut()}>
				Sign Out
			</button>
		</div>
	);
};

export default SignInPage;
