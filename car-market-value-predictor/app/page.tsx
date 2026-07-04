"use client";

import { FormEvent, useEffect, useState } from "react";

type VehicleForm = {
  Present_Price: string;
  Kms_Driven: string;
  Owner: string;
  Car_Age: string;
  Fuel_Type: string;
  Seller_Type: string;
  Transmission: string;
};

type Tree = {
  children_left: number[];
  children_right: number[];
  feature: number[];
  threshold: number[];
  value: number[];
};

type BrowserModel = {
  model_type: string;
  feature_names: string[];

  numerical_features: string[];
  categorical_features: string[];

  scaler: {
    mean: number[];
    scale: number[];
  };

  encoder: Record<string, string[]>;

  gradient_boosting: {
    initial_prediction: number;
    learning_rate: number;
    n_estimators: number;
    trees: Tree[];
  };
};

const initialForm: VehicleForm = {
  Present_Price: "",
  Kms_Driven: "",
  Owner: "",
  Car_Age: "",
  Fuel_Type: "",
  Seller_Type: "",
  Transmission: "",
};

export default function Home() {
  const [form, setForm] = useState<VehicleForm>(initialForm);
  const [model, setModel] = useState<BrowserModel | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [modelError, setModelError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const response = await fetch("/models/model.json");

        if (!response.ok) {
          throw new Error("Unable to load prediction model.");
        }

        const modelData: BrowserModel = await response.json();

        setModel(modelData);
      } catch (loadError) {
        console.error(loadError);

        setModelError(
          "The prediction model could not be loaded. Please refresh the page.",
        );
      }
    };

    loadModel();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  };

  const preprocessInput = (
    vehicle: VehicleForm,
    modelData: BrowserModel,
  ): number[] => {
    const numericalValues = modelData.numerical_features.map((feature) => {
      const value = vehicle[feature as keyof VehicleForm];

      return Number(value);
    });

    const scaledNumericalValues = numericalValues.map(
      (value, index) =>
        (value - modelData.scaler.mean[index]) /
        modelData.scaler.scale[index],
    );

    const encodedCategoricalValues: number[] = [];

    modelData.categorical_features.forEach((feature) => {
      const categories = modelData.encoder[feature];

      const selectedValue = vehicle[feature as keyof VehicleForm];

      categories.forEach((category) => {
        encodedCategoricalValues.push(
          selectedValue === category ? 1 : 0,
        );
      });
    });

    return [
      ...scaledNumericalValues,
      ...encodedCategoricalValues,
    ];
  };

  const predictTree = (
    tree: Tree,
    features: number[],
  ): number => {
    let node = 0;

    while (tree.children_left[node] !== -1) {
      const featureIndex = tree.feature[node];
      const threshold = tree.threshold[node];

      if (features[featureIndex] <= threshold) {
        node = tree.children_left[node];
      } else {
        node = tree.children_right[node];
      }
    }

    return tree.value[node];
  };

  const predictMarketValue = (
    vehicle: VehicleForm,
    modelData: BrowserModel,
  ): number => {
    const features = preprocessInput(vehicle, modelData);

    const gradientBoosting = modelData.gradient_boosting;

    let predictedValue = gradientBoosting.initial_prediction;

    gradientBoosting.trees.forEach((tree) => {
      const treePrediction = predictTree(tree, features);

      predictedValue +=
        gradientBoosting.learning_rate * treePrediction;
    });

    return predictedValue;
  };

  const validateForm = (): boolean => {
    if (Object.values(form).some((value) => value === "")) {
      setError("Please complete all vehicle details.");

      return false;
    }

    const presentPrice = Number(form.Present_Price);
    const kmsDriven = Number(form.Kms_Driven);
    const owner = Number(form.Owner);
    const carAge = Number(form.Car_Age);

    if (presentPrice <= 0) {
      setError("Present price must be greater than zero.");

      return false;
    }

    if (kmsDriven < 0) {
      setError("Kms driven cannot be negative.");

      return false;
    }

    if (owner < 0 || !Number.isInteger(owner)) {
      setError("Owner count must be a non-negative whole number.");

      return false;
    }

    if (carAge < 0 || !Number.isInteger(carAge)) {
      setError("Car age must be a non-negative whole number.");

      return false;
    }

    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPrediction(null);
    setError("");

    if (!validateForm()) {
      return;
    }

    if (!model) {
      setError("Prediction model is still loading. Please try again.");

      return;
    }

    setIsPredicting(true);

    try {
      const predictedValue = predictMarketValue(form, model);

      setPrediction(Math.max(0, predictedValue));
    } catch (predictionError) {
      console.error(predictionError);

      setError(
        "Unable to calculate the market value. Please try again.",
      );
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07101f] text-[#dce6ff]">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col px-5 pb-16 pt-8 sm:px-8 lg:px-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e8bc5b]">
            <span aria-hidden="true">▣</span>
            <span>Resale Intelligence</span>
          </div>

          <h1 className="mx-auto mt-14 max-w-[780px] text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-[#dce6ff] sm:text-5xl lg:text-[58px]">
            Predict Your Car&apos;s Market Value Instantly
          </h1>

          <p className="mx-auto mt-7 max-w-[670px] text-sm leading-7 text-[#b0b8c9] sm:text-base">
            Enter your vehicle&apos;s specifications and get an
            instant, data-driven resale estimate — no dealership
            guesswork.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-16 rounded-xl border border-[#2a3951] bg-[#111c30] px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:px-10 sm:py-10"
        >
          <div className="border-b border-[#233149] pb-5">
            <h2 className="text-xl font-semibold text-[#dce6ff]">
              Vehicle Details
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Present Price (₹ Lakhs)
              </span>

              <input
                type="number"
                name="Present_Price"
                value={form.Present_Price}
                onChange={handleInputChange}
                placeholder="e.g. 8.50"
                min="0"
                step="0.01"
                className="h-12 rounded-lg border border-[#506078] bg-[#121d31] px-4 text-sm text-[#e3ebff] outline-none transition placeholder:text-[#9099aa] focus:border-[#38d5f4] focus:ring-2 focus:ring-[#38d5f4]/10"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Kms Driven
              </span>

              <input
                type="number"
                name="Kms_Driven"
                value={form.Kms_Driven}
                onChange={handleInputChange}
                placeholder="e.g. 45000"
                min="0"
                step="1"
                className="h-12 rounded-lg border border-[#506078] bg-[#121d31] px-4 text-sm text-[#e3ebff] outline-none transition placeholder:text-[#9099aa] focus:border-[#38d5f4] focus:ring-2 focus:ring-[#38d5f4]/10"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Owner Count
              </span>

              <input
                type="number"
                name="Owner"
                value={form.Owner}
                onChange={handleInputChange}
                placeholder="e.g. 0"
                min="0"
                step="1"
                className="h-12 rounded-lg border border-[#506078] bg-[#121d31] px-4 text-sm text-[#e3ebff] outline-none transition placeholder:text-[#9099aa] focus:border-[#38d5f4] focus:ring-2 focus:ring-[#38d5f4]/10"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Car Age (Years)
              </span>

              <input
                type="number"
                name="Car_Age"
                value={form.Car_Age}
                onChange={handleInputChange}
                placeholder="e.g. 5"
                min="0"
                step="1"
                className="h-12 rounded-lg border border-[#506078] bg-[#121d31] px-4 text-sm text-[#e3ebff] outline-none transition placeholder:text-[#9099aa] focus:border-[#38d5f4] focus:ring-2 focus:ring-[#38d5f4]/10"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Fuel Type
              </span>

              <select
                name="Fuel_Type"
                value={form.Fuel_Type}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#1b2639] bg-[#050b15] px-4 text-sm text-[#dce6ff] outline-none transition focus:border-[#38d5f4]"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Seller Type
              </span>

              <select
                name="Seller_Type"
                value={form.Seller_Type}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#1b2639] bg-[#050b15] px-4 text-sm text-[#dce6ff] outline-none transition focus:border-[#38d5f4]"
              >
                <option value="">Select Seller Type</option>
                <option value="Dealer">Dealer</option>
                <option value="Individual">Individual</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#c7cede]">
                Transmission
              </span>

              <select
                name="Transmission"
                value={form.Transmission}
                onChange={handleInputChange}
                className="h-12 rounded-lg border border-[#1b2639] bg-[#050b15] px-4 text-sm text-[#dce6ff] outline-none transition focus:border-[#38d5f4]"
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="mt-6 text-center text-sm text-[#ff8d8d]">
              {error}
            </p>
          )}

          {modelError && (
            <p className="mt-6 text-center text-sm text-[#ff8d8d]">
              {modelError}
            </p>
          )}

          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              disabled={isPredicting || !model}
              className="min-w-[260px] rounded-lg bg-gradient-to-r from-[#8ce7fa] to-[#16c9ee] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#072033] shadow-[0_0_30px_rgba(22,201,238,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(22,201,238,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPredicting
                ? "Calculating Value..."
                : model
                  ? "Predict Market Value  ▣"
                  : "Loading Model..."}
            </button>
          </div>
        </form>

        {prediction !== null && (
          <section
            aria-live="polite"
            className="mt-10 rounded-xl border border-[#2c3a50] bg-[#202d43] px-6 py-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.2)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8be7fa]">
              ◉ Estimated Market Value
            </p>

            <p className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#dce6ff] sm:text-5xl">
              ₹ {prediction.toFixed(2)} Lakhs
            </p>

            <p className="mt-4 text-sm text-[#9ca8bc]">
              ML-powered resale estimate based on your vehicle
              details.
            </p>
          </section>
        )}

        <section className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-[#18263a] bg-[#091324] px-5 py-7 text-center">
            <div className="text-xl text-[#e8bc5b]">▣</div>

            <p className="mt-4 text-[11px] tracking-[0.08em] text-[#c9d0df]">
              ML-Powered Valuation
            </p>
          </div>

          <div className="rounded-lg border border-[#18263a] bg-[#091324] px-5 py-7 text-center">
            <div className="text-xl text-[#e8bc5b]">◴</div>

            <p className="mt-4 text-[11px] tracking-[0.08em] text-[#c9d0df]">
              Instant Browser Prediction
            </p>
          </div>

          <div className="rounded-lg border border-[#18263a] bg-[#091324] px-5 py-7 text-center">
            <div className="text-xl text-[#e8bc5b]">▤</div>

            <p className="mt-4 text-[11px] tracking-[0.08em] text-[#c9d0df]">
              Data-Driven Estimate
            </p>
          </div>
        </section>
      </section>

      <footer className="border-t border-[#111e31] bg-[#06101f] px-5 py-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.12em] text-[#778399]">
          Resale Intelligence • Machine Learning Powered Vehicle
          Valuation
        </p>

        <p className="mt-7 text-[10px] uppercase tracking-[0.1em] text-[#59667b]">
          © 2026 Resale Intelligence. Precision Data Systems.
        </p>
      </footer>
    </main>
  );
}