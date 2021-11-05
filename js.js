async function fetchCV2() {
	var resp = await fetch('https://raw.githubusercontent.com/tyleo-rec/CircuitsV2Resources/master/misc/circuitsv2.json')
	var data = await resp.json()
	return data
}

async function main() {
	const cv2 = await fetchCV2()
	const nodes = Object.keys(cv2.Nodes)
	
	// console.log(cv2)

	function searchCV2(value) {
		$('#search-results').empty()
		
		// console.log(cv2.Nodes)

		for (var i = 0; i < nodes.length; i++) {
			let raw_name = nodes[i]
			let chip = cv2.Nodes[nodes[i]]
			let results = [];
			
			// Search through all and check if value is inside chip name
			if (chip.ReadonlyName.toLowerCase().includes(value.toLowerCase())) {
				var inputs
				var outputs

				try { var inputs = chip.NodeDescs[0].Inputs}
				catch { var inputs = []}
				
				try { var outputs = chip.NodeDescs[0].Outputs}
				catch { var outputs = []}
				
				// console.log(outputs)
				
				results.push([
							chip.ReadonlyName,
							inputs,
							outputs,
							raw_name,
							])
			}

			// Append all elements found in search to table
			results.forEach(function(elem) {
				list_item = document.createElement('li')
				
				$('#search-results').append(list_item)
				
				// Append chip name/hash to an attribute to lookup later
				list_item.chip = elem[3]

				list_item.onclick = function(e) {
					if (e.target.classList.contains('clickable') || e.target.tagName == 'LI') {
						let target = e.target.closest('li')
						if (target.className == '') {
							if (target.querySelector('.chip-details-container') === null){
								let chip_details = cv2.Nodes[target.chip]
								
								console.log(chip_details)

								let cont = document.createElement('div')
								let descTitle = document.createElement('p')
								let desc = document.createElement('p')
								
								cont.classList.add('chip-details-container')
								cont.id = 'chip-info-container'

								if (chip_details.Description != ''){
									desc.textContent = chip_details.Description
								} else {
									desc.textContent = 'No Description Available.'
								}

								desc.style.fontWeight = 300
								
								target.addEventListener("transitionend", function() {
									if (this.style.height == '80px') {
										cont.remove()
									}
								});

								target.addEventListener("transitionstart", function() {
									let container = this.querySelector('.chip-details-container')

									if (container !== null) {
										if (this.style.height == '80px') {
											container.style.marginTop = '80px'
											container.style.opacity = 0
										} else if (parseInt(this.style.height) > 80) {
											container.style.opacity = 1
											container.style.marginTop = '40px'
										}
									}
								});
								
								descTitle.textContent = 'Description'
								descTitle.classList.add('chip-description')
								descTitle.classList.add('clickable')
								desc.classList.add('clickable')
								
								cont.append(descTitle)
								cont.append(desc)
								target.append(cont)

								target.className = 'on-click-chip'
								target.style.height = '400px'
							}
						} else {
							target.className = ''
							// target.transition().style('height','80px').on('end', function() {this.remove()})
							target.style.height = '80px'
							
							// target.querySelector('.chip-details-container').empty()
							// target.querySelector('.chip-details-container').on('transitionend').remove()
						}
						// console.log(cv2.Nodes[target.chip])
					}
				}
				
				chip = document.createElement('div')
				chip.className = 'clickable chip-preview'

				inputs = document.createElement('div')
				inputs.className = 'clickable input-port'
				
				outputs = document.createElement('div')
				outputs.className = 'clickable output-port'
				
				elem[1].forEach(function(input) {
					chipInput = document.createElement('div')
					let name = input.ReadonlyType.split(' ').join('-').replace('<','-').replace('>','').toLowerCase()
					chipInput.className = 'clickable chip-port chip-type-' + name

					inputs.append(chipInput)
				})
				
				elem[2].forEach(function(output) {
					chipOutput = document.createElement('div')
					let name = output.ReadonlyType.split(' ').join('-').replace('<','-').replace('>','').toLowerCase()
					chipOutput.className = 'clickable chip-port chip-type-' + name

					outputs.append(chipOutput)
				})
				
				chip.append(inputs)
				chip.append(outputs)
				
				list_item.append(chip)
				
				text = document.createElement('p')
				text.textContent = elem[0]
				text.className = 'clickable'
				list_item.append(text)
			})
		}
	}
	
	searchCV2('')

	$('#search-cv2').on('input',function(e){
		searchCV2(e.target.value)
	});
	

	
}
main()