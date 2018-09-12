import { wait } from "../util";

const DEFAULT_MAX_REPEAT_COUNT = 5;

export const withRepeating: WithRepeatingFunction = function(
    func,
    maxRepeatCount = DEFAULT_MAX_REPEAT_COUNT
): WithRepeatingFunctionResult {
    return async function() {
        let repeatCount = maxRepeatCount;
        const errorsAccumulator = [];

        while (repeatCount > 0) {
            const { error, result } = await func();

            if (error) {
                repeatCount--;
                errorsAccumulator.push(error);

                await wait();
            } else {
                return {
                    succeeded: true,
                    errors: errorsAccumulator,
                    result
                };
            }
        }

        return {
            succeeded: false,
            errors: errorsAccumulator,
            result: null
        };
    };
};

export interface WithRepeatingFunction {
    (
        func: RepeatableFunction,
        maxRepeatCount?: number
    ): WithRepeatingFunctionResult;
}
interface WithRepeatingFunctionResult {
    (): Promise<RepeatedFunctionResult>;
}
export interface RepeatedFunctionResult {
    succeeded: boolean;
    errors: any[];
    result: any;
}

export interface RepeatableFunction {
    (...args: any[]): Promise<RepeatableFunctionResult>;
}
export interface RepeatableFunctionResult {
    error: any;
    result: any;
}
