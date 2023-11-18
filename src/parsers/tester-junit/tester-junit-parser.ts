import {ParseOptions} from '../../test-parser'
import {TestRunResult, TestSuiteResult} from '../../test-results'
import {JavaJunitParser} from '../java-junit/java-junit-parser'
import {JunitReport} from '../java-junit/java-junit-types'

export class TesterJunitParser extends JavaJunitParser {
  constructor(readonly options: ParseOptions) {
    super(options)
  }

  protected override getTestRunResult(filePath: string, junit: JunitReport): TestRunResult {
    const suites =
      junit.testsuites.testsuite === undefined
        ? []
        : junit.testsuites.testsuite.map(ts => {
            const name = ts.$.name?.trim() ?? 'Test Suite'
            const time = parseFloat(ts.$.time) * 1000
            const sr = new TestSuiteResult(name, this.getGroups(ts), time)
            return sr
          })

    const seconds = parseFloat(junit.testsuites.$?.time)
    const time = isNaN(seconds) ? undefined : seconds * 1000
    return new TestRunResult(filePath, suites, time)
  }
}
