import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Range } from "../Range";

describe("Range Component", () => {
	const defaultProps = {
		min: 0,
		max: 100,
		step: 1,
		label: "Test Range",
	};

	describe("Rendering", () => {
		it("should render with initial values", () => {
			render(<Range {...defaultProps} />);

			expect(screen.getByText("Test Range")).toBeInTheDocument();
			expect(screen.getByText("0")).toBeInTheDocument();
			expect(screen.getByText("100")).toBeInTheDocument();
		});

		it("should render with custom initial values", () => {
			render(
				<Range {...defaultProps} initialMinValue={25} initialMaxValue={75} />,
			);

			expect(screen.getByText("25")).toBeInTheDocument();
			expect(screen.getByText("75")).toBeInTheDocument();
		});

		it("should render two slider thumbs with proper ARIA attributes", () => {
			render(<Range {...defaultProps} />);

			const sliders = screen.getAllByRole("slider");
			expect(sliders).toHaveLength(2);

			expect(sliders[0]).toHaveAttribute("aria-valuemin", "0");
			expect(sliders[0]).toHaveAttribute("aria-valuemax", "100");
			expect(sliders[0]).toHaveAttribute("aria-valuenow", "0");
			expect(sliders[0]).toHaveAttribute("aria-valuetext", "Minimum value: 0");

			expect(sliders[1]).toHaveAttribute("aria-valuemin", "0");
			expect(sliders[1]).toHaveAttribute("aria-valuemax", "100");
			expect(sliders[1]).toHaveAttribute("aria-valuenow", "100");
			expect(sliders[1]).toHaveAttribute(
				"aria-valuetext",
				"Maximum value: 100",
			);
		});

		it("should have proper aria-labelledby reference", () => {
			render(<Range {...defaultProps} />);

			const sliders = screen.getAllByRole("slider");
			expect(sliders[0]).toHaveAttribute("aria-labelledby", "range-label");
			expect(sliders[1]).toHaveAttribute("aria-labelledby", "range-label");
		});
	});

	describe("Keyboard Navigation - Min Thumb", () => {
		it("should increase value with ArrowRight", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowRight}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "51");
			});
		});

		it("should increase value with ArrowUp", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowUp}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "51");
			});
		});

		it("should decrease value with ArrowLeft", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowLeft}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "49");
			});
		});

		it("should decrease value with ArrowDown", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowDown}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "49");
			});
		});

		it("should jump to minimum with Home key", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{Home}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "0");
			});
		});

		it("should jump to max value (current max) with End key", async () => {
			const user = userEvent.setup();
			render(
				<Range {...defaultProps} initialMinValue={25} initialMaxValue={75} />,
			);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{End}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "75");
			});
		});

		it("should increase by 10 with PageUp", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{PageUp}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "60");
			});
		});

		it("should decrease by 10 with PageDown", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{PageDown}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "40");
			});
		});
	});

	describe("Keyboard Navigation - Max Thumb", () => {
		it("should increase value with ArrowRight", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMaxValue={50} />);

			const maxSlider = screen.getAllByRole("slider")[1];
			act(() => {
				maxSlider.focus();
			});

			await user.keyboard("{ArrowRight}");

			await waitFor(() => {
				expect(maxSlider).toHaveAttribute("aria-valuenow", "51");
			});
		});

		it("should decrease value with ArrowLeft", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMaxValue={50} />);

			const maxSlider = screen.getAllByRole("slider")[1];
			act(() => {
				maxSlider.focus();
			});

			await user.keyboard("{ArrowLeft}");

			await waitFor(() => {
				expect(maxSlider).toHaveAttribute("aria-valuenow", "49");
			});
		});

		it("should jump to maximum with End key", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMaxValue={50} />);

			const maxSlider = screen.getAllByRole("slider")[1];
			act(() => {
				maxSlider.focus();
			});

			await user.keyboard("{End}");

			await waitFor(() => {
				expect(maxSlider).toHaveAttribute("aria-valuenow", "100");
			});
		});

		it("should jump to min value (current min) with Home key", async () => {
			const user = userEvent.setup();
			render(
				<Range {...defaultProps} initialMinValue={25} initialMaxValue={75} />,
			);

			const maxSlider = screen.getAllByRole("slider")[1];
			act(() => {
				maxSlider.focus();
			});

			await user.keyboard("{Home}");

			await waitFor(() => {
				expect(maxSlider).toHaveAttribute("aria-valuenow", "25");
			});
		});
	});

	describe("Value Constraints", () => {
		it("should not allow min value to exceed max value", async () => {
			const user = userEvent.setup();
			render(
				<Range {...defaultProps} initialMinValue={90} initialMaxValue={95} />,
			);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowRight>10}");

			await waitFor(() => {
				const currentValue = Number.parseInt(
					minSlider.getAttribute("aria-valuenow") || "0",
					10,
				);
				expect(currentValue).toBeLessThanOrEqual(95);
			});
		});

		it("should not allow max value to go below min value", async () => {
			const user = userEvent.setup();
			render(
				<Range {...defaultProps} initialMinValue={45} initialMaxValue={50} />,
			);

			const maxSlider = screen.getAllByRole("slider")[1];
			act(() => {
				maxSlider.focus();
			});

			await user.keyboard("{ArrowLeft>10}");

			await waitFor(() => {
				const currentValue = Number.parseInt(
					maxSlider.getAttribute("aria-valuenow") || "0",
					10,
				);
				expect(currentValue).toBeGreaterThanOrEqual(45);
			});
		});

		it("should not allow min value below minimum", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={0} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowLeft}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "0");
			});
		});

		it("should not allow max value above maximum", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMaxValue={100} />);

			const maxSlider = screen.getAllByRole("slider")[1];
			act(() => {
				maxSlider.focus();
			});

			await user.keyboard("{ArrowRight}");

			await waitFor(() => {
				expect(maxSlider).toHaveAttribute("aria-valuenow", "100");
			});
		});
	});

	describe("Value Editing", () => {
		it("should allow editing min value by clicking label", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minLabel = screen.getByRole("button", {
				name: /Minimum value: 50/i,
			});
			await user.click(minLabel);

			const input = screen.getByLabelText("Edit minimum value");
			expect(input).toBeInTheDocument();
			expect(input).toHaveValue(50);
		});

		it("should allow editing max value by clicking label", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMaxValue={50} />);

			const maxLabel = screen.getByRole("button", {
				name: /Maximum value: 50/i,
			});
			await user.click(maxLabel);

			const input = screen.getByLabelText("Edit maximum value");
			expect(input).toBeInTheDocument();
			expect(input).toHaveValue(50);
		});

		it("should update min value when edited and blurred", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minLabel = screen.getByRole("button", {
				name: /Minimum value: 50/i,
			});
			await user.click(minLabel);

			const input = screen.getByLabelText("Edit minimum value");
			await user.clear(input);
			await user.type(input, "30");
			await user.tab();

			await waitFor(() => {
				expect(screen.getByText("30")).toBeInTheDocument();
			});
		});

		it("should update value on Enter key", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minLabel = screen.getByRole("button", {
				name: /Minimum value: 50/i,
			});
			await user.click(minLabel);

			const input = screen.getByLabelText("Edit minimum value");
			await user.clear(input);
			await user.type(input, "30{Enter}");

			await waitFor(() => {
				expect(screen.getByText("30")).toBeInTheDocument();
			});
		});

		it("should cancel edit on Escape key", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} initialMinValue={50} />);

			const minLabel = screen.getByRole("button", {
				name: /Minimum value: 50/i,
			});
			await user.click(minLabel);

			const input = screen.getByLabelText("Edit minimum value");
			await user.clear(input);
			await user.type(input, "30{Escape}");

			await waitFor(() => {
				expect(screen.getByText("50")).toBeInTheDocument();
			});
		});

		it("should clamp edited min value to not exceed max", async () => {
			const user = userEvent.setup();
			render(
				<Range {...defaultProps} initialMinValue={50} initialMaxValue={60} />,
			);

			const minLabel = screen.getByRole("button", {
				name: /Minimum value: 50/i,
			});
			await user.click(minLabel);

			const input = screen.getByLabelText("Edit minimum value");
			await user.clear(input);
			await user.type(input, "80{Enter}");

			await waitFor(() => {
				const minSlider = screen.getAllByRole("slider")[0];
				expect(minSlider).toHaveAttribute("aria-valuenow", "60");
			});
		});

		it("should clamp edited max value to not go below min", async () => {
			const user = userEvent.setup();
			render(
				<Range {...defaultProps} initialMinValue={40} initialMaxValue={60} />,
			);

			const maxLabel = screen.getByRole("button", {
				name: /Maximum value: 60/i,
			});
			await user.click(maxLabel);

			const input = screen.getByLabelText("Edit maximum value");
			await user.clear(input);
			await user.type(input, "20{Enter}");

			await waitFor(() => {
				const maxSlider = screen.getAllByRole("slider")[1];
				expect(maxSlider).toHaveAttribute("aria-valuenow", "40");
			});
		});
	});

	describe("onChange Callback", () => {
		it("should call onChange when values change via keyboard", async () => {
			const user = userEvent.setup();
			const handleChange = jest.fn();
			render(
				<Range
					{...defaultProps}
					initialMinValue={50}
					onChange={handleChange}
				/>,
			);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowRight}");

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({
					minValue: 51,
					maxValue: 100,
				});
			});
		});

		it("should call onChange when values are edited", async () => {
			const user = userEvent.setup();
			const handleChange = jest.fn();
			render(
				<Range
					{...defaultProps}
					initialMinValue={50}
					onChange={handleChange}
				/>,
			);

			const minLabel = screen.getByRole("button", {
				name: /Minimum value: 50/i,
			});
			await user.click(minLabel);

			const input = screen.getByLabelText("Edit minimum value");
			await user.clear(input);
			await user.type(input, "30{Enter}");

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({
					minValue: 30,
					maxValue: 100,
				});
			});
		});
	});

	describe("Step Functionality", () => {
		it("should respect custom step value", async () => {
			const user = userEvent.setup();
			render(<Range {...defaultProps} step={5} initialMinValue={50} />);

			const minSlider = screen.getAllByRole("slider")[0];
			act(() => {
				minSlider.focus();
			});

			await user.keyboard("{ArrowRight}");

			await waitFor(() => {
				expect(minSlider).toHaveAttribute("aria-valuenow", "55");
			});
		});
	});
});
