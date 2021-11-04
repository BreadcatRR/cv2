async function fetchCV2() {
	var resp = await fetch('https://raw.githubusercontent.com/tyleo-rec/CircuitsV2Resources/master/misc/circuitsv2.json')
	var data = await resp.json()
	return data
}

async function main() {
	const cv2 = await fetchCV2()
	const nodes = Object.keys(cv2.Nodes)
	
	console.log(cv2)

	function searchCV2(value) {
		$('#search-results').empty()

		for (var i = 0; i < nodes.length; i++) {
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
				
				console.log(outputs)
				
				results.push([
							chip.ReadonlyName,
							inputs,
							outputs,
							])
			}

			// Append all elements found in search to table
			results.forEach(function(elem) {
				list_item = document.createElement('li')
				
				
				$('#search-results').append(list_item)
	
				// list_item.addEventListener("click", function(e) {
				// 	console.log(e.target.className)
				// 	if (e.target.className == '') {
				// 				e.target.className = 'on-click-chip'
				// 				e.target.style.height = '400px'
				// 			} else {
				// 				e.target.className = ''
				// 				e.target.style.height = '80px'

				// 			}
				// });
				list_item.onclick = function(e) {
					if (e.target.classList.contains('clickable') || e.target.tagName == 'LI') {
						let target = e.target.closest('li')
						if (target.className == '') {
							target.className = 'on-click-chip'
							target.style.height = '400px'
						} else {
							target.className = ''
							target.style.height = '80px'
						}
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