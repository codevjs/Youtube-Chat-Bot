const puppeteer = require("puppeteer");
const chromium  = require('chrome-aws-lambda');
const {sleep}   = require("../utils");

class YoutubeLiveChat {

    constructor(url) {
        this.baseURL = url;
        this.browser = null;
        this.page    = null;
    }

    fetch = async (cb) => {
        try {
            const records    = [];
            const args       = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ];

            this.browser = await puppeteer.launch({
                headless : false,
                args,
                defaultViewport: chromium.defaultViewport,
            });

            this.page = await this.browser.newPage();

            console.log('Membuka Youtube Live Chat');

            await this.page.goto(this.baseURL, {waitUntil: 'load', timeout: 0});

            console.log("Youtube Live Chat Berhasil Terbuka")

            while (true) {

                let chatList = await this.page.evaluate(() => {

                    let list = document.querySelectorAll("yt-live-chat-text-message-renderer");

                    let records = []

                    list.forEach(item => {

                        let photo      = item.children[0]?.children[1]?.src ?? item.children[0]?.children[0]?.src;
                        let timestamp  = item.children[1].children[0].textContent;
                        let authorName = item.children[1].children[1].children[1].textContent;
                        let message    = item.children[1].children[3].textContent;

                        records.push({
                            photo,
                            timestamp,
                            authorName,
                            message
                        });
                    });

                    return records;
                });

                records.push(...chatList);

                const filteredRecord = records.reduce((acc, current) => {

                    const x = acc.find(item => item.timestamp === current.timestamp && item.message === current.message);

                    return !x ? acc.concat([current]): acc;

                }, []);

                cb(filteredRecord);

                await sleep(500);
            }
        } catch (e) {

            console.log(e.message);
        }
    };

}

module.exports = YoutubeLiveChat
