export const readFile = async file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = ({ target: { result } }) => {
      resolve(result)
    }
    reader.onerror = err => {
      console.error(err)
      reject(new Error('couldn\'t read file'))
    }
  })
