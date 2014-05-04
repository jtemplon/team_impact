var initialize = function(){
	var prefix = '',
	allData,
	firstCountry,
	secondCountry,
	firstData,
	secondData,
	currentData;
	setUpSubmit();
	loadAllData();
	hideShowCard($('#card_1'));
	$('#world_second_2').click();
};

var setUpSubmit = function (){
	$('a[name="card_2"]').click(onSubmit);
	$('.next_button').not('.main_button').click(advanceCard);
	$('.country_list').first().find('li').click(function(){
		if ($(this).css('opacity') !== '0.5') {
		
		$('.country_list').last().find('li').css('opacity', 1);
		firstCountry = $(this).attr('id').replace('_first_1', '')
		$('.country_list').first().find('li').removeClass('active');
		$(this).addClass('active');
		$('#'+ firstCountry + '_second_2').css('opacity', '0.5')
	}
	})
	$('.country_list').last().find('li').click(function(){
		if ($(this).css('opacity') !== '0.5') {
		
		$('.country_list').first().find('li').css('opacity', 1);
		secondCountry = $(this).attr('id').replace('_second_2', '')
		$('.country_list').last().find('li').removeClass('active');
		$(this).addClass('active');
		$('#'+ secondCountry + '_first_1').css('opacity', '0.5')
	}
	})

	if ($('.country_list').first().find('li.active').length) {
		firstCountry = $('.country_list').first().find('li.active').attr('id').replace('_first_1', '')
	}

	if ($('.country_list').last().find('li.active').length) {
		secondCountry = $('.country_list').last().find('li.active').attr('id').replace('_second_2', '')
	}
}

var makeBigger = function(elementSelector) {
	var circleSize = secondData['protein'];
	if (!circleSize) circleSize= 200;
	console.log(secondData, circleSize)
	$('.sizer').animate({width: circleSize + 'px', height: circleSize + 'px'}, 3000)
};

var loadAllData = function() {
	$.ajax({
  		url: "meat_data.json"
	}).success(function(data) {
  		allData = data;
	});
};

var selectData = function(prefix) {
	$.each(allData, function(index, item) {
		if (index.indexOf(countryLookup(prefix)) != -1) {
			currentData = allData[index];
		}
	})
	return currentData
};

var cardVisualization = {
	2: 'icons',
	3: 'size'
};

var countryLookup = function(prefix){
	var lookup = {
	'unitedstates': 'United States of America',
	'china': 'China',
	'brazil': 'Brazil',
	'japan': 'Japan',
	'tanzania': 'United Republic of Tanzania',
	'world': 'World'
}
return lookup[prefix]
};

var onSubmit = function(){
	event.preventDefault();
	if (typeof(firstCountry) === 'undefined') {
		alert('Select a country from the first row.')
		return false;
	} else if (typeof(secondCountry) === 'undefined') {
		alert('Select a country from the second row.')
		return false;
	} else {
		$.each($('.content_card'), function(index, item) {
		firstData = selectData(firstCountry);
		secondData = selectData(secondCountry);
			cardNumber = $(item).attr('id').replace('card_', '');
			cardVizType = cardVisualization[cardNumber];
			if (cardVizType == 'icons') {
				addMultipleIconsStart(item, firstData, secondData);
			} else if (cardVizType === 'size') {
				setUpCircle(item, firstData, secondData);
			};
		});	
	}
	
	hideShowCard($('#card_2'), firstData, secondData);
};

var addMultipleIconsStart = function(element, firstData, secondData) {
	var iconNumber = Number((firstData['protein']).toFixed(0));
	var array = new Array(iconNumber);
	$(element).find('.icon').remove();

	$.each(array, function(index, item){
		$(element).find('.item_icons').prepend('<div class="icon"></div>')
	})
};

var addMultipleIconsEnd = function(element, firstData, secondData) {
	var oldIconNumber = firstData['protein'];
	var iconNumber = secondData['protein'];
	if (!iconNumber) iconNumber = 50
	if (!oldIconNumber) iconNumber = 50
		oldIconNumber = Number((oldIconNumber).toFixed(0));
		iconNumber = Number((iconNumber).toFixed(0));
	diff = iconNumber - oldIconNumber;
	var array = new Array(Math.abs(diff));
	$.each(array, function(index, item){
		if (diff > 0) {
			$(element).find('.item_icons .clear').before('<div class="icon_added icon"></div>')
		}
		else {
			$('#card_' + cardNumber).find('.item_icons .icon').slice(diff).addClass('icon_added');
		}
	})
};

var setUpCircle = function(item, firstData, secondData) {
	var circleSize = firstData['protein'];
	console.log(circleSize)
	$('.sizer_initial').css({width: circleSize, height: circleSize})
	$('.sizer').css({width: circleSize, height: circleSize})
};

var advanceCard = function(event){
	event.preventDefault();
	var currentlyShownCard = $('.content_card:visible');
	var currentlyShownCardNumber = currentlyShownCard.attr('id').replace('card_', '')
	var newCardNumber = Number(currentlyShownCardNumber) +1
	var newCardToShow = $('#card_' + newCardNumber);
	if ($(newCardToShow).length == 1) {
		hideShowCard(newCardToShow);
	} else {
		hideShowCard($('#card_1'));
		firstCountry = undefined;
		secondCountry = undefined;
	}
};

var hideShowCard = function(cardElement, firstData, secondData) {
	$('.content_card').hide();
	cardElement.fadeIn(1500, function(){
		cardNumber = cardElement.attr('id').replace('card_', '')
		if (cardVisualization[cardNumber] === 'icons') {
			addMultipleIconsEnd(cardElement, firstData, secondData)
		} else if (cardVisualization[cardNumber] === 'size') {
			makeBigger(cardElement, firstData, secondData);
		}
		if (cardNumber === 1) {
			$('#world_second_2').click();
		}
	});
	
};

$(initialize);