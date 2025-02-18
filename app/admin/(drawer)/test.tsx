import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PieChart from "react-native-pie-chart";
import {
  LineChart,
  BarChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

const DonutChart = () => {
  // Sample data with values and colors
  const data = [
    { value: 30, label: "Food", color: "#ff6384" },
    { value: 20, label: "Transport", color: "#36a2eb" },
    { value: 15, label: "Shopping", color: "#ffce56" },
    { value: 35, label: "Other", color: "#4bc0c0" },
  ];

  const data23 = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43]
    }
  ]
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

  const [selectedSlice, setSelectedSlice] = useState<{ label: string; value: number } | null>(null);

  const widthAndHeight = 200; // Chart size
  const series = data.map((item) => item.value); // Extract only values
  const sliceColor = data.map((item) => item.color); // Extract only colors

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={data} // Only numerical values
          sliceColor={sliceColor} // Colors for each slice
          coverRadius={0.6} // Creates the donut effect
          coverFill="white"
          cover={0.75}
        />
        {/* Centered Label and Value */}
        <View style={styles.centerText}>
          <Text style={styles.label}>
            {selectedSlice ? selectedSlice.label : "Total"}
          </Text>
          <Text style={styles.value}>
            {selectedSlice ? selectedSlice.value : series.reduce((a, b) => a + b, 0)}
          </Text>
        </View>
      </View>

      {/* Legend with hover effect */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedSlice(item)}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <BarChart
        // style={graphStyle}
        data={data23}
        width={200}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  legendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DonutChart;
