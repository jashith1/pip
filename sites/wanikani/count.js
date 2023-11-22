function showProgress() {
	let totalLearned = 0;
	let totalBurned = 0;
	let totalPending = 0;
	let newItems = 0;
	let lockedItems = 0;

	$('.container .character-grid .character-grid__items').each((index, level) => {
		let pendingItems = 0;
		let learnedItems = 0;
		let burnedItems = 0;
		$(level)
			.children()
			.each((index, item) => {
				if (item.children.length > 1) {
					pendingItems++;
					newItems++;
					return true;
				}
				const classes = $(item).find('a').attr('class').split(' ');
				if (classes.length == 2) {
					learnedItems++;
					return true;
				}
				let status = classes[2].split('-');
				status = status[status.length - 1];
				if (status == 'burned') burnedItems++;
				else if (status == 'locked') pendingItems++;
				else if (status == 'recent') learnedItems++;
				else console.log('unkown elememt ' + status);
			});

		learnedItems += burnedItems;

		const gridElement = $(`.container .character-grid:eq('${index}') `);
		gridElement.find('header').css('padding-bottom', '0px');

		const levelProgressHeader = $('<header></header>')
			.attr('id', 'level_progress_header')
			.addClass('subject-legend')
			.css({
				'padding-top': '0px',
				'padding-bottom': '20px',
				'margin-bottom': '0px',
			})
			.append($(`<h4>Learned: ${learnedItems}</h4>`))
			.append($(`<h4>Pending: ${pendingItems}</h4>`))
			.append($(`<h4>Burned: ${burnedItems}</h4>`));
		gridElement.children().eq(1).after(levelProgressHeader);

		totalBurned += burnedItems;
		totalLearned += learnedItems;
		totalPending += pendingItems;
	});

	lockedItems = totalPending - newItems;

	$('.container .subject-legend .subject-legend__items .subject-legend__item .subject-legend__item-title').each((index, item) => {
		if (index === 0) $(item).text('New Items: ' + newItems);
		else if (index === 1) $(item).text('Learned: ' + lockedItems);
		else if (index === 2) $(item).text('Learned: ' + (totalLearned - totalBurned));
		else if (index === 3) $(item).text('Burned: ' + totalBurned);
	});
	console.log('Total learned: ' + totalLearned);
}

showProgress();

const observer = new MutationObserver((mutationsList) => {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			if (!document.getElementById('level_progress_header')) {
				showProgress();
			}
		}
	}
});

observer.observe(document.body, { childList: true, subtree: true });
