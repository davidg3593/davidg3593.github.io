import { Avatar, Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { IMessage, IRole } from '../constants/interfaces'
import { Check, Close, HorizontalRule } from '@mui/icons-material'
import moment from 'moment'
const Home = () => {
	const [message, setMessage] = useState<IMessage>()
	const [prevMessage, setPrevMessage] = useState<IMessage>()
	const [guesses, setGuesses] = useState<{ value: string; status: 'success' | 'failure' }[]>([])
	const [currentGuess, setCurrentGuess] = useState<string>('')
	const [randomRole, setRandomRole] = useState<IRole>()
	const [error, setError] = useState<string>('')

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
		fetchJSONData()
	}, [])

	useEffect(() => {
		getRandomRole()
		console.log(message)
	}, [message])

	const handleGuess = () => {
		setError('')
		if (!!!message) return
		if (!!guesses.find((g) => g.value === currentGuess)) {
			setError('You already tried that')
			return
		}
		if (
			!!message.author.nickname.toLowerCase().includes(currentGuess.toLowerCase()) ||
			!!message.author.name.toLowerCase().includes(currentGuess.toLowerCase())
		) {
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
		<Box>
			<Box marginBottom='50px'>
				<Typography variant='h1' textAlign='center'>
					Discordle
				</Typography>
				<Typography variant='h5' textAlign='center'>
					You have 4 guesses to figure out who wrote the following message:
				</Typography>
			</Box>

			{guesses.length >= 3 && !!prevMessage && (
				<Box
					style={{ backgroundColor: '#313338' }}
					width='100%'
					maxWidth='1000px'
					margin='auto'
					minHeight='48px'
					padding='20px'
					display='flex'>
					<Avatar style={{ margin: '0 17px' }} src={prevMessage.author.avatarUrl} />
					<Box>
						<Box display='flex'>
							<Typography
								style={{ fontSize: '16px', lineHeight: '1.375rem', marginRight: '.25rem', verticalAlign: 'baseline' }}>
								{prevMessage.author.nickname}
							</Typography>
							<Typography
								style={{ fontSize: '.75rem', lineHeight: '1.375rem', verticalAlign: 'baseline', color: '#939aa3' }}>
								{moment(prevMessage.timestamp).format('DD-MM-YYYY HH:mm')}
							</Typography>
						</Box>
						<Typography style={{ color: '#dadde0', fontSize: '16px' }}>{prevMessage.content}</Typography>
					</Box>
				</Box>
			)}
			<Box
				style={{ backgroundColor: '#313338' }}
				width='100%'
				maxWidth='1000px'
				margin='auto'
				minHeight='48px'
				padding='20px'
				display='flex'>
				<Avatar style={{ margin: '0 17px' }}>?</Avatar>
				<Box width='90%'>
					<Box display='flex'>
						<Typography
							style={{ fontSize: '16px', lineHeight: '1.375rem', marginRight: '.25rem', verticalAlign: 'baseline' }}>
							Unknown User
						</Typography>
						<Typography
							style={{ fontSize: '.75rem', lineHeight: '1.375rem', verticalAlign: 'baseline', color: '#939aa3' }}>
							{guesses.length >= 1 && !!message ? moment(message.timestamp).format('DD-MM-YYYY HH:mm') : 'Unknown date'}
						</Typography>
					</Box>
					{!!message ? (
						<Fragment>
							<Typography
								style={{
									color: !!message.embeds.length ? '#0a9ff5' : '#dadde0',
									fontSize: '16px',
									textDecoration: !!message.embeds.length ? 'underline' : 'none'
								}}>
								{!!message.embeds.length || !!message.content.startsWith('https://') ? (
									<a
										href={!!message.embeds.length ? message.embeds[0].url : message.content}
										style={{
											color: '#0a9ff5',
											fontSize: '16px',
											textDecoration: 'underline'
										}}
										target='_blank'>
										{message.content.replace(/\\n/g, '\n')}
									</a>
								) : (
									message.content.replace(/\\n/g, '\n')
								)}
							</Typography>
							{message.embeds.map((e) => {
								return (
									<Box
										style={{
											backgroundColor: '#2b2d30',
											borderLeft: '4px solid #1d1e21',
											padding: '.5rem 1rem 1rem .75rem'
										}}
										display='flex'
										width='100%'>
										<Box width='70%'>
											{!!e.title && (
												<Typography style={{ color: '#0a9ff5', fontSize: '1rem', fontWeight: '600' }}>
													{e.title}
												</Typography>
											)}
											{!!e.description && (
												<Typography style={{ color: '#dadde0', fontSize: '0.875rem' }}>{e.description}</Typography>
											)}
										</Box>

										{!!e.thumbnail && (
											<Box width='30%'>
												<div style={{ width: '100%', height: '100%' }}>
													<img
														src={e.thumbnail.url}
														style={{ objectFit: 'cover', width: '100%', height: '100%' }}></img>
												</div>
											</Box>
										)}
									</Box>
								)
							})}
						</Fragment>
					) : (
						<CircularProgress />
					)}
				</Box>
			</Box>
			<Box display='flex' justifyContent='center' width='100%' margin='20px 0'>
				{guesses.length <= 0 ? (
					<HorizontalRule />
				) : guesses[0].status === 'success' ? (
					<Check color='success' />
				) : (
					<Close color='error' />
				)}
				{guesses.length >= 2 ? (
					guesses[1].status === 'success' ? (
						<Check color='success' />
					) : (
						<Close color='error' />
					)
				) : (
					<HorizontalRule />
				)}
				{guesses.length >= 3 ? (
					guesses[2].status === 'success' ? (
						<Check color='success' />
					) : (
						<Close color='error' />
					)
				) : (
					<HorizontalRule />
				)}
				{guesses.length >= 4 ? (
					guesses[3].status === 'success' ? (
						<Check color='success' />
					) : (
						<Close color='error' />
					)
				) : (
					<HorizontalRule />
				)}
			</Box>
			{!!message && (
				<Box height='160px' maxWidth='1000px' margin='auto'>
					{guesses.length >= 1 && (
						<Typography>
							First hint: This message was written on {moment(message.timestamp).format('DD-MM-YYYY HH:mm')}
						</Typography>
					)}
					{guesses.length >= 2 && !!randomRole && (
						<Typography>
							The user who wrote this message has the role:{' '}
							<span style={!!randomRole.color ? { color: randomRole.color } : {}}>{randomRole.name}</span>
						</Typography>
					)}
					{guesses.length >= 3 && (
						<Typography>Third hint: You now get to see the message that came before this one</Typography>
					)}
					{!!guesses.filter((g) => g.status === 'success').length ? (
						<Typography>Congrats! You found the correct user!</Typography>
					) : guesses.length >= 4 && guesses[3].status === 'failure' ? (
						<Typography>Womp womp, the correct user was {message.author.nickname}</Typography>
					) : (
						<Fragment />
					)}
				</Box>
			)}
			<Box width='100%' maxWidth='1000px' margin='auto' display='flex'>
				<TextField
					fullWidth
					label='Name or nickname of user'
					value={currentGuess}
					onChange={(e) => {
						setCurrentGuess(e.target.value)
					}}
				/>
				<Button
					disabled={
						!!!message ||
						!!guesses.filter((g) => g.status === 'success').length ||
						!!!currentGuess ||
						guesses.length >= 4
					}
					variant='contained'
					onClick={handleGuess}>
					Submit
				</Button>
			</Box>
			{!!error && <Typography style={{ color: 'red' }}>{error}</Typography>}
			{/* {!!guesses.filter((g) => g.status === 'success').length && ( */}
			<Box display='flex' justifyContent='center' margin='20px'>
				<Button variant='contained' onClick={handleNewGame}>
					New game
				</Button>
			</Box>
			{/* )} */}
		</Box>
	)
}

export default Home
