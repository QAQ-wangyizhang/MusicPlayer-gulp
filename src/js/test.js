const A = 'abcde',
    B = 'cdeab'

let rotateString = function (A, B) {
    if (A.length > 100 || B.length > 100 || !A || !B) {
        return
    }
    let arr = A.split('');
    for (let i = 0; i < arr.length - 1; i++) {
        let first = arr[0];
        arr.splice(0, 1)
        arr.push(first)
    }
};

rotateString(A, B);