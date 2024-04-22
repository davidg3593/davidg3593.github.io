import { Fragment, useEffect, useState } from 'react'
import { IMessage, IRole } from '../constants/interfaces'
import moment from 'moment'
import { Check, Close, HorizontalRule } from '../components/icons'

const Home = () => {
	const [message, setMessage] = useState<IMessage>()
	const [prevMessage, setPrevMessage] = useState<IMessage>()
	const [guesses, setGuesses] = useState<{ value: string; status: 'success' | 'failure' }[]>([])
	const [currentGuess, setCurrentGuess] = useState<string>('')
	const [randomRole, setRandomRole] = useState<IRole>()
	const [error, setError] = useState<string>('')
	const [allUserOptions, setAllUserOptions] = useState<{ [nickname: string]: number }>({})

	const randomIntFromInterval = (min: number, max: number) => {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	useEffect(() => {
		const fetchJSONData = async () => {
			try {
				setGuesses([])
				const response = await fetch('/discordle/chat_logs.json')
				const responseData = await response.json()
				const filteredMessages: IMessage[] = responseData.messages.filter(
					(m: IMessage) => !!!m.author.isBot && (!!m.content || !!m.embeds.length)
				)
				let allUsers: { [nickname: string]: number } = {}
				for (let m of filteredMessages) {
					allUsers[m.author.nickname] = !!allUsers[m.author.nickname] ? allUsers[m.author.nickname] + 1 : 1
				}
				setAllUserOptions(allUsers)
				const randomMessagePos = randomIntFromInterval(0, filteredMessages.length - 1)
				setMessage(filteredMessages[randomMessagePos])
				console.log(filteredMessages[randomMessagePos])
				setPrevMessage(filteredMessages[randomMessagePos - 1])
			} catch (e) {
				console.error(e)
			}
		}
		fetchJSONData()
	}, [])

	useEffect(() => {
		getRandomRole()
	}, [message])

	const handleGuess = () => {
		setError('')
		if (!!!message) return
		if (!!guesses.find((g) => g.value === currentGuess)) {
			setError('You already tried that')
			return
		}
		if (!!message.author.nickname.toLowerCase().includes(currentGuess.toLowerCase())) {
			let newGuessesArray = guesses
			newGuessesArray.push({
				value: currentGuess,
				status: 'success'
			})
			setGuesses(newGuessesArray)
		} else {
			let newGuessesArray = guesses
			newGuessesArray.push({
				value: currentGuess,
				status: 'failure'
			})
			setGuesses(newGuessesArray)
		}
		setCurrentGuess('')
	}

	const getRandomRole = () => {
		if (!!!message) return
		const pos = randomIntFromInterval(0, message.author.roles.length - 1)
		const role = message.author.roles[pos]
		setRandomRole(role)
	}

	const handleNewGame = async () => {
		try {
			setGuesses([])
			const response = await fetch('/discordle/chat_logs.json')
			const responseData = await response.json()
			const filteredMessages = responseData.messages.filter(
				(m: IMessage) => !!!m.author.isBot && (!!m.content || !!m.embeds.length)
			)
			const randomMessagePos = randomIntFromInterval(0, filteredMessages.length - 1)
			setMessage(filteredMessages[randomMessagePos])
			console.log(filteredMessages[randomMessagePos])
			setPrevMessage(filteredMessages[randomMessagePos - 1])
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div>
			<div style={{ marginBottom: '50px' }}>
				<h1 style={{ textAlign: 'center' }}>Discordle</h1>
				<h3 style={{ textAlign: 'center' }}>You have 4 guesses to figure out who wrote the following message:</h3>
			</div>

			{guesses.length >= 3 && !!prevMessage && (
				<div
					style={{
						backgroundColor: '#313338',
						width: '100%',
						maxWidth: '1000px',
						margin: 'auto',
						minHeight: '48px',
						padding: '20px',
						display: 'flex'
					}}>
					<img
						style={{
							margin: '0 17px',
							width: '40px',
							height: '40px',
							borderRadius: '50px'
						}}
						src={prevMessage.author.avatarUrl}
					/>
					<div style={{ width: '90%' }}>
						<div style={{ display: 'flex' }}>
							<p
								style={{
									fontSize: '16px',
									lineHeight: '1.375rem',
									margin: '0 .25rem 0 0',
									verticalAlign: 'baseline',
									color: prevMessage.author.color
								}}>
								{prevMessage.author.nickname}
							</p>
							<p
								style={{
									fontSize: '.75rem',
									lineHeight: '1.375rem',
									verticalAlign: 'baseline',
									color: '#939aa3',
									margin: '0'
								}}>
								{moment(prevMessage.timestamp).format('DD-MM-YYYY HH:mm')}
							</p>
						</div>

						<p
							style={{
								color: !!prevMessage.embeds.length ? '#0a9ff5' : '#dadde0',
								fontSize: '16px',
								textDecoration: !!prevMessage.embeds.length ? 'underline' : 'none',
								margin: '3px 0 0 0'
							}}>
							{!!prevMessage.embeds.length || !!prevMessage.content.startsWith('https://') ? (
								<a
									href={!!prevMessage.embeds.length ? prevMessage.embeds[0].url : prevMessage.content}
									style={{
										color: '#0a9ff5',
										fontSize: '16px',
										textDecoration: 'underline',
										margin: '3px 0 0 0'
									}}
									target='_blank'>
									{prevMessage.content.replace(/\\n/g, '\n')}
								</a>
							) : (
								prevMessage.content.replace(/\\n/g, '\n')
							)}
						</p>
						{prevMessage.embeds.map((e) => {
							return (
								<div
									style={{
										backgroundColor: '#2b2d30',
										borderLeft: '4px solid #1d1e21',
										padding: '.5rem 1rem 1rem .75rem',
										display: 'flex',
										width: '100%',
										borderRadius: '0 15px 15px 0'
									}}>
									<div style={{ width: '70%' }}>
										{!!e.title && <p style={{ color: '#0a9ff5', fontSize: '1rem', fontWeight: '600' }}>{e.title}</p>}
										{!!e.description && <p style={{ color: '#dadde0', fontSize: '0.875rem' }}>{e.description}</p>}
									</div>

									{!!e.thumbnail && (
										<div style={{ width: '30%' }}>
											<div style={{ width: '100%', height: '100%' }}>
												<img
													src={e.thumbnail.url}
													style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '15px' }}></img>
											</div>
										</div>
									)}
								</div>
							)
						})}
					</div>
				</div>
			)}
			<div
				style={{
					backgroundColor: '#313338',
					width: '100%',
					maxWidth: '1000px',
					margin: 'auto',
					minHeight: '48px',
					padding: '20px',
					display: 'flex'
				}}>
				<div
					style={{
						margin: '0 17px',
						width: '40px',
						height: '40px',
						backgroundColor: 'grey',
						textAlign: 'center',
						lineHeight: '40px',
						borderRadius: '50px'
					}}>
					?
				</div>
				<div style={{ width: '90%' }}>
					<div style={{ display: 'flex' }}>
						<p
							style={{
								fontSize: '16px',
								lineHeight: '1.375rem',
								margin: '0 .25rem 0 0',
								verticalAlign: 'baseline',
								color: 'green'
							}}>
							Unknown User
						</p>
						<p
							style={{
								fontSize: '.75rem',
								lineHeight: '1.375rem',
								verticalAlign: 'baseline',
								color: '#939aa3',
								margin: '0'
							}}>
							{guesses.length >= 1 && !!message ? moment(message.timestamp).format('DD-MM-YYYY HH:mm') : 'Unknown date'}
						</p>
					</div>
					{!!message ? (
						<Fragment>
							<p
								style={{
									color: !!message.embeds.length ? '#0a9ff5' : '#dadde0',
									fontSize: '16px',
									textDecoration: !!message.embeds.length ? 'underline' : 'none',
									margin: '3px 0 0 0'
								}}>
								{!!message.embeds.length || !!message.content.startsWith('https://') ? (
									<a
										href={!!message.embeds.length ? message.embeds[0].url : message.content}
										style={{
											color: '#0a9ff5',
											fontSize: '16px',
											textDecoration: 'underline',
											margin: '3px 0 0 0'
										}}
										target='_blank'>
										{message.content.replace(/\\n/g, '\n')}
									</a>
								) : (
									message.content.replace(/\\n/g, '\n')
								)}
							</p>
							{message.embeds.map((e) => {
								return (
									<div
										style={{
											backgroundColor: '#2b2d30',
											borderLeft: '4px solid #1d1e21',
											padding: '.5rem 1rem 1rem .75rem',
											display: 'flex',
											width: '100%',
											borderRadius: '0 15px 15px 0'
										}}>
										<div style={{ width: '70%' }}>
											{!!e.title && <p style={{ color: '#0a9ff5', fontSize: '1rem', fontWeight: '600' }}>{e.title}</p>}
											{!!e.description && <p style={{ color: '#dadde0', fontSize: '0.875rem' }}>{e.description}</p>}
										</div>

										{!!e.thumbnail && (
											<div style={{ width: '30%' }}>
												<div style={{ width: '100%', height: '100%' }}>
													<img
														src={e.thumbnail.url}
														style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '15px' }}></img>
												</div>
											</div>
										)}
									</div>
								)
							})}
						</Fragment>
					) : (
						<p>Loading...</p>
					)}
				</div>
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '20px 0' }}>
				{guesses.length <= 0 ? <HorizontalRule /> : guesses[0].status === 'success' ? <Check /> : <Close />}
				{guesses.length >= 2 ? guesses[1].status === 'success' ? <Check /> : <Close /> : <HorizontalRule />}
				{guesses.length >= 3 ? guesses[2].status === 'success' ? <Check /> : <Close /> : <HorizontalRule />}
				{guesses.length >= 4 ? guesses[3].status === 'success' ? <Check /> : <Close /> : <HorizontalRule />}
			</div>
			{!!message && (
				<div style={{ height: '160px', maxWidth: '1000px', margin: 'auto' }}>
					{guesses.length >= 1 && (
						<p>First hint: This message was written on {moment(message.timestamp).format('DD-MM-YYYY HH:mm')}</p>
					)}
					{guesses.length >= 2 && !!randomRole && (
						<p>
							The user who wrote this message has the role:{' '}
							<span style={!!randomRole.color ? { color: randomRole.color } : {}}>{randomRole.name}</span>
						</p>
					)}
					{guesses.length >= 3 && <p>Third hint: You now get to see the message that came before this one</p>}
					{!!guesses.filter((g) => g.status === 'success').length ? (
						<p>Congrats! You found the correct user!</p>
					) : guesses.length >= 4 && guesses[3].status === 'failure' ? (
						<p>Womp womp, the correct user was {message.author.nickname}</p>
					) : (
						<Fragment />
					)}
				</div>
			)}
			<div
				style={{
					width: '100%',
					maxWidth: '1000px',
					margin: 'auto',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end'
				}}>
				<div style={{ width: '88%' }}>
					<label htmlFor='currentGuessInput'>Name or nickname of user:</label>
					{/* <input
						id='currentGuessInput'
						name='currentGuessInput'
						type='text'
						style={{
							width: '100%',
							height: '30px',
							borderRadius: '10px',
							border: '1px solid #313338',
							padding: '1px 5px'
						}}
						value={currentGuess}
						onChange={(e) => {
							setCurrentGuess(e.target.value)
						}}
					/> */}
					<select
						id='currentGuessInput'
						name='currentGuessInput'
						value={currentGuess}
						style={{
							width: '100%',
							height: '30px',
							borderRadius: '10px',
							border: '1px solid #313338',
							padding: '1px 5px'
						}}
						onChange={(e) => {
							setCurrentGuess(e.target.value)
						}}>
						<option value=''>Choisir une option</option>
						{Object.keys(allUserOptions)
							.map((key) => {
								return [key, allUserOptions[key]]
							})
							.sort((a, b) => (a[1] as number) - (b[1] as number))
							.reverse()
							.map((o) => {
								return (
									<option value={o[0]}>
										{o[0]} - {o[1]} messages
									</option>
								)
							})}
					</select>
				</div>

				<button
					className='button1'
					disabled={
						!!!message ||
						!!guesses.filter((g) => g.status === 'success').length ||
						!!!currentGuess ||
						guesses.length >= 4
					}
					onClick={handleGuess}>
					Submit
				</button>
			</div>
			{!!error && <p style={{ color: 'red' }}>{error}</p>}
			{/* {!!guesses.filter((g) => g.status === 'success').length && ( */}
			<div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
				<button className='button2' onClick={handleNewGame}>
					New game
				</button>
			</div>
			{/* )} */}
		</div>
	)
}

export default Home
