module.exports = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],
  /**
   * Rules are made up by a name and a configuration array. 
   * The configuration array contains:
   * Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
   * Applicable always|never: never inverts the rule.
   * Value: value to use for this rule.
   */
  rules: {
    'header-max-length': [1, 'always', 80],
    'body-max-line-length': [2, 'always', 80],
    'subject-min-length': [2, 'always', 5],
    'type-enum': [2, 'always',[
      'build',
      'ci',
      'chore',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test',
      'merge',
    ]]
  },
  defaultIgnores: true,
};