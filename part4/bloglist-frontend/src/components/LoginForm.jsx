const LoginForm = ({
	handleLogin,
	username,
	password,
	handleUsername,
	handlePassword,
}) => {
	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label>
						username
						<input type="text" value={username} onChange={handleUsername} />
					</label>
				</div>
				<div>
					<label>
						password
						<input type="text" value={password} onChange={handlePassword} />
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
