define(function(require) {
    var Tests = {
        // TODO add tests
        testCases: [
            [ // wiki http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714.svg
                // solution http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714_solution.svg
                '53--7----',
                '6--195---',
                '-98----6-',
                '8---6---3',
                '4--8-3--1',
                '7---2---6',
                '-6----28-',
                '---419--5',
                '----8--79'
            ],
            [ // same board as above, but almost finish, to test the success message
                '534678912',
                '672195348',
                '198342567',
                '859761423',
                '4268-3791',
                '713924856',
                '9615-7284',
                '287419635',
                '345286179'
            ]
        ]
    };

    return Tests;
});
