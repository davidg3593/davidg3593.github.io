export interface IRole {
	id: string
	name: string
	color: string | null
	position: number
}

export interface IMessage {
	id: string
	type: string
	timestamp: string
	timestampEdited: string | null
	callEndedTimestamp: string | null
	isPinned: boolean
	content: string
	author: {
		id: string
		name: string
		discriminator: string
		nickname: string
		color: string
		isBot: boolean
		roles: IRole[]
		avatarUrl: string
	}
	attachments: {
		id: string
		url: string
		fileName: string
		fileSizeBytes: number
	}[]
	embeds: {
		title: string
		url: string
		timestamp: any
		description: string
		thumbnail: {
			url: string
			width: number
			height: number
		}
		video?: {
			url: string
			width: number
			height: number
		}
		images: any[]
		fields: any[]
	}[]
	stickers: any[]
	reactions: any[]
	mentions: any[]
}
