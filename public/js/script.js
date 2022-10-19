
import langWords from './langWords.js'

function addDelClass( elem, className ) {
	if ( elem.classList.contains(className + '_active') ) {
		elem.classList.remove(className + '_active')
	} else {
		elem.classList.add(className + '_active')
	}
}

function menuOpen() {
	const menuIcon = document.querySelector('.header-menu')
	const menuNav = document.querySelector('.header-nav')
	const wrapper = document.querySelector('.wrapper')

	if ( !menuIcon ) {
		return false
	}

	document.addEventListener('click', (ev) => {
		const targetEl = ev.target

		if ( targetEl.classList.contains('header-nav__link') && menuNav.classList.contains('header-nav_active') ) {
			menuNav.classList.remove('header-nav_active')
			wrapper.classList.remove('wrapper_active')
			menuIcon.classList.remove('header-menu_active')
		}
	})

	menuIcon.addEventListener('click', () => {
		addDelClass(menuIcon, 'header-menu')
		addDelClass(menuNav, 'header-nav')
		addDelClass(wrapper, 'wrapper')
	})
}

const changeUrl = (ev) => {
	const langName = ev.currentTarget.dataset.lang
	location.href = `${ window.location.pathname }#${ langName }`
	location.reload()
}

function changeLangInp(currLang) {

	const elems = document.querySelectorAll(`.lang-footer-inp`)

	elems.forEach(( elem, idx ) => {
		elem.setAttribute('placeholder', `${ langWords['footer-inp'][currLang][idx] }`)
	})

}

const changeLang = () => {
	const hashLangList = ['rus', 'eng', 'kaz']
	const langName = location.hash.slice(1) || 'rus'

	if ( !hashLangList.includes(langName) ) {
		location.href = `${ window.location.pathname }#${ 'rus' }`
		return false
	}

	for (let key in langWords) {
		const elems = document.querySelectorAll(`.lang-${ key }`)
		elems.forEach(( item, idx ) => item.innerHTML = langWords[key][langName][idx])
	}

	changeLangInp(langName)

}

const langBtnsAddActive = ( btns ) => {
	const langName = location.hash.slice(1) || 'rus'

	btns.forEach(btn => {
		if ( btn.dataset.lang === langName ) {
			btn.classList.add('header-lang-btns__btn_active')
		} else {
			btn.classList.remove('header-lang-btns__btn_active')
		}
	})

}

function changeLangBtnInit() {
	const langBtns = document.querySelectorAll('.header-lang-btns__btn')

	langBtns.forEach(btn => {
		btn.addEventListener('click', changeUrl)
	})
	changeLang()
	langBtnsAddActive(langBtns)
}

function sliderInit() {
	const swiper = new Swiper('.swiper', {
		// Optional parameters
		direction: 'horizontal',
		loop: true,
	
		// Navigation arrows
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
		
			// when window width is >= 480px
			480: {
				slidesPerView: 1,
				spaceBetween: 10
			},
			// when window width is >= 640px
			640: {
				slidesPerView: 2,
				spaceBetween: 40
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 60
			},
			1040: {
				slidesPerView: 3,
				spaceBetween: 50
			}
		}
	});
}

function getTime() {
	let CURRENT_TIME = +localStorage.getItem('time') || 3037565
	let months = Math.round(CURRENT_TIME / ( 86400 * 30))
	let days = Math.round(CURRENT_TIME / 86400) - (months * 30)
	let hours = parseInt((CURRENT_TIME - ((months * 30 + days) * 86400)) / 3600)
	let seconds = CURRENT_TIME % 60
	let minutes = ((CURRENT_TIME - seconds) - ((months * 30 + days) * 86400) - (hours * 3600)) / 60
	CURRENT_TIME++
	localStorage.setItem('time', `${ CURRENT_TIME }`)
	return [
		months, days, hours, minutes, seconds
	]
}

function timerInit() {
	localStorage.setItem('time', '3037565')
	const statTitleSpans = document.querySelectorAll('.statistics__title_red')

	setInterval(() => {

		let data = getTime()

		statTitleSpans.forEach((item, idx) => {
			item.textContent = data[idx]
		})

	}, 1000)


}

function submitForm() {

	const formEl = document.querySelector('#footerForm')
	const userName = document.querySelector('#userName')
	const userPhone = document.querySelector('#userPhone')

	formEl.addEventListener('submit', ev => {
		ev.preventDefault()
		let nameBool = isValidInputName(userName)
		let phoneBool = isValidInputPhone(userPhone)

		if (nameBool && phoneBool) {
			userName.value = ''
			userPhone.value = ''
			showModal()
		} else {
			return false
		}
	})
}

function showModal() {
	const modalWrap = document.querySelector('.modal-wrap')
	const wrapper = document.querySelector('.wrapper')

	addDelClass(modalWrap, 'modal-wrap')
	addDelClass(wrapper, 'wrapper')

	setTimeout(() => {
		addDelClass(modalWrap, 'modal-wrap')
		addDelClass(wrapper, 'wrapper')
	}, 3000)
}

function isValidInputPhone(el) {
	const PHONE_REGEXP = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
	let inpValue = el.value.trim()
	if ( PHONE_REGEXP.test(inpValue) ) {
		el.closest('label').classList.remove('footer-form__lbl_is-not-valid')
		return true
	} else {
			el.closest('label').classList.add('footer-form__lbl_is-not-valid')
			return false
	}
}
function isValidInputName(el) {
	const NAME_MIN_LENGTH = 2
	let inpValue = el.value.trim()
	if ( NAME_MIN_LENGTH <= inpValue.length ) {
		el.closest('label').classList.remove('footer-form__lbl_is-not-valid')
		return true
	} else {
			el.closest('label').classList.add('footer-form__lbl_is-not-valid')
			return false
	}
}

document.addEventListener('DOMContentLoaded', () => {
	menuOpen()
	changeLangBtnInit()
	sliderInit()
	// timerInit()
	submitForm()
})