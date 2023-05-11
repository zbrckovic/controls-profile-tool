export async function readFile (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function ({ target: { result } }) {
      resolve(result)
    }
    reader.onerror = function (err) {
      console.error(err)
      reject(new Error('couldn\'t read file'))
    }
  })
}
