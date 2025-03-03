export interface NewsItem {
	url: string
	title: string
	date: string
	summary: string
	fullText?: string // Full article content
	imageUrl?: string // Main image from article
}