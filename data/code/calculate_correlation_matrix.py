import pandas as pd

# Load the CSV file
file_path = '/mnt/data/2022.csv'
data = pd.read_csv(file_path)

# Calculate the correlation matrix
correlation_matrix = data.corr()

# Reshape the correlation matrix into a long format suitable for heatmap visualization
correlation_matrix_long = correlation_matrix.reset_index().melt(id_vars='index')
correlation_matrix_long.rename(columns={'index': 'Variable 1', 'variable': 'Variable 2', 'value': 'Correlation'}, inplace=True)

# Save the reformatted correlation matrix to a CSV file
heatmap_format_file_path = '/mnt/data/heatmap_correlation_matrix.csv'
correlation_matrix_long.to_csv(heatmap_format_file_path, index=False)


