const { remote } = require('webdriverio');

(async function () {
    let client;

    try {
        // Set up WebDriverIO client
        client = await remote({
            path: '/',
            port: 4723,
            capabilities: {
                "appium:platformName": 'iOS',
                "appium:platformVersion": '17.2',
                "appium:deviceName": 'iPhone 15',
                "appium:bundleId": 'org.reactjs.native.example.detoxTest',
                "appium:automationName": 'XCUITest',
                "appium:noReset": true,
            }
        });

        // Test cases
        await resetApp(client);
        await shouldHaveHelloText(client);
        await shouldNotHaveWeatherDetails(client);
        await pressCheckWeatherButton(client);
        await shouldHaveWeatherDetails(client);
        await pressCheckWeatherButton(client);
        await shouldNotHaveWeatherDetails(client);

    console.log('All tests passed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        if (client) {
            await client.deleteSession();
        }
    }
})();

async function resetApp(client) {
    // Reset app by relaunching it
    await client.execute('mobile: terminateApp', { bundleId: 'org.reactjs.native.example.detoxTest' });
    await client.execute('mobile: launchApp', { bundleId: 'org.reactjs.native.example.detoxTest' });
}

async function shouldHaveHelloText(client) {
    const titleElement = await client.$('~helloText');
    if (!(await titleElement.isDisplayed())) {
        throw new Error('Hello text is not visible');
    }
}

async function pressCheckWeatherButton(client) {
    const checkWeatherButton = await client.$('~checkWeatherButton');
    await checkWeatherButton.click();
}

async function shouldNotHaveWeatherDetails(client) {
    const titleElement = await client.$('~weatherDetails');
    if (await titleElement.isDisplayed()) {
        throw new Error('Weather details are visible');
    }
}

async function shouldHaveWeatherDetails(client) {
    const timeout = 10_000; 

    return new Promise(async (resolve, reject) => {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const titleElement = await client.$('~weatherDetails');
            if (await titleElement.isDisplayed()) {
                resolve(); // Resolve the promise if weather details are visible
                return;
            }
            // Wait for a short interval before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        reject(new Error('Weather details not visible after 3 seconds')); // Reject if weather details are not visible after the timeout
    });
}
