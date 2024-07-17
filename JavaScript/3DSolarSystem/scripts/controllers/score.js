class Score{
    constructor(score) {
        this.score = score;
    }


    updateScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.innerHTML = `Score: ${this.score}`;
        console.log("hit!")
    }

    increaseScore() {
        this.score++;
        this.updateScore();
    }
}

export { Score }