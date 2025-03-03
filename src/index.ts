import { runCrawler } from './crawler.js'

async function main() {
	try {
		await runCrawler()
		console.log('Crawling completed. Check storage/datasets/default/ for results.')
	} catch (error) {
		console.error('Crawling failed:', error)
	}
}

main()