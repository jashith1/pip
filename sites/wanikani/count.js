function showProgress() {
	$('.container .character-grid .character-grid__items').each((index, level) => {
		let incompleteItems = 0;
		let completedItems = 0;
		let burnedItems = 0;
		$(level)
			.children()
			.each((index, item) => {
				if (item.children.length > 1) {
					incompleteItems++;
					return true;
				}
				const classes = $(item).find('a').attr('class').split(' ');
				if (classes.length == 2) {
					completedItems++;
					return true;
				}
				let status = classes[2].split('-');
				status = status[status.length - 1];
				if (status == 'burned') burnedItems++;
				else if (status == 'locked') incompleteItems++;
				else if (status == 'recent') completedItems++;
				else console.log('unkown elememt ' + status);
			});

		completedItems += burnedItems;

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
			.append($(`<h4>Completed: ${completedItems}</h4>`))
			.append($(`<h4>Incomplete: ${incompleteItems}</h4>`))
			.append($(`<h4>Burned: ${burnedItems}</h4>`));
		gridElement.children().eq(1).after(levelProgressHeader);
	});
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
