---
layout: page
title: NYC Yellow Taxi Tipping Project
description: R, Shiny, linear regression, and RAG project for DS 6306.
importance: 1
category: data-science
---

This project used 2025 NYC Yellow Taxi trip data to predict recorded tip amount and explain which trip characteristics were most useful for the model.

The final model was a multiple linear regression model built in R. It predicted `tip_amount` using fare amount, trip distance, passenger count, airport fee, MTA-related fees, tolls, vendor, rate code, quarter, and day of week. The model was evaluated on a held-out test set using MSPE, RMSE, and MAE.

Final test-set results:

- MSPE: 1.698646
- RMSE: 1.303321
- MAE: 0.9242648

The project also includes a Shiny dashboard with EDA tabs, model results, and a RAG question-answer component. The RAG tool uses the project notes as a knowledge base and answers questions about the EDA, model variables, test results, and interpretation.

[Open the Shiny app](https://jdmontgomery12.shinyapps.io/nyc-yellow-taxi-tipping-project/){:target="_blank"}

