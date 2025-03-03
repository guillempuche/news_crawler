import { CheerioCrawler, Dataset } from 'crawlee'
import type { NewsItem } from './types.js'

export async function runCrawler() {
	// Open separate datasets
	const summariesDataset = await Dataset.open('news_summaries')
	const articlesDataset = await Dataset.open('news_articles')

	const crawler = new CheerioCrawler({
		maxRequestsPerCrawl: 50, // Allow more requests for articles and pagination
		async requestHandler({ $, request, enqueueLinks }) {
			console.log('Processing:', request.url)

			// Handle news list pages (including pagination)
			if (request.url.includes('/ajuntament/comunicacio/actualitat.htm')) {
				// Enqueue article links
				await enqueueLinks({
					selector: 'ul.llista-amb-imatge-requadres li.columna a:first-child',
					baseUrl: 'https://www.olot.cat',
					label: 'ARTICLE',
				})

				// Enqueue pagination links
				await enqueueLinks({
					selector: 'div.paginacio a.link-paginacio',
					baseUrl: 'https://www.olot.cat',
					label: 'LIST',
				})

				// Extract summaries from list page
				const summaries: NewsItem[] = []
				$('ul.llista-amb-imatge-requadres li.columna').each((_, element) => {
					const linkElement = $(element).find('a:first-child')
					const url = linkElement.attr('href') || ''
					const title = linkElement.attr('title') || ''
					const dateElement = $(element).find('p.texte').first()
					const date = dateElement.text().trim()
					const summaryElement = dateElement.next('p.texte')
					const summary = summaryElement.text().trim()

					if (url && title && date) {
						summaries.push({
							url: `https://www.olot.cat${url}`,
							title,
							date,
							summary,
						})
					}
				})

				if (summaries.length > 0) {
					await summariesDataset.pushData(summaries)
					console.log(`Saved ${summaries.length} summaries from ${request.url}`)
				} else {
					console.log('No summaries found on this page.')
				}
			}
			// Handle individual news articles
			else if (request.label === 'ARTICLE') {
				const title = $('h1.titol-registre').text().trim()
				const date = $('p.subtitol-data').text().trim()
				const summary = $('span > p:first-child').text().trim()
				const fullText = $('span')
					.children('p')
					.map((_, p) => $(p).text().trim())
					.get()
					.join('\n')
				const imageUrl = $('ul.adjunts-imatges img').attr('src') || ''

				if (title && date && summary) {
					const article: NewsItem = {
						url: request.url,
						title,
						date,
						summary,
						fullText,
						imageUrl: imageUrl ? `https://www.olot.cat${imageUrl}` : undefined,
					}
					await articlesDataset.pushData(article)
					console.log(`Saved article: ${title}`)
				} else {
					console.log(`No data extracted from article: ${request.url}`)
				}
			}
		},
	})

	// Start the crawler
	await crawler.run(['https://www.olot.cat/ajuntament/comunicacio/actualitat.htm'])
}