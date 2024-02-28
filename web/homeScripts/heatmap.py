import folium
from folium.plugins import HeatMap, MarkerCluster
import pandas as pd
from uniCoordsLaw import universities_coordinates  # Ensure this is correctly imported

# Read the CSV file directly
df = pd.read_csv('../../db/data/outputOverallLaw.csv')
df = df[df['Joint submission'] == 'Overall']
df['Average Score'] = ((df['% of eligible staff submitted'] * 4) + (df['4*'] * 3) + (df['3*'] * 2) + (df['2*'] * 1)) / 100
print(df)
# Convert universities_coordinates to a DataFrame for easier manipulation
universities_df = pd.DataFrame(list(universities_coordinates.items()), columns=['University', 'Coordinates'])

# Merge the average scores into the universities DataFrame
universities_df = universities_df.merge(df[['Institution code (UKPRN)', 'Average Score']], left_on='University', right_on='Institution code (UKPRN)', how='left')
# Extract Latitude and Longitude
universities_df[['Latitude', 'Longitude']] = pd.DataFrame(universities_df['Coordinates'].tolist(), index=universities_df.index)
# Use the 'Average Score' as intensity; fill missing values with a default intensity if needed
default_intensity = universities_df['Average Score'].mean()
universities_df['Average Score'].fillna(default_intensity, inplace=True)

# Create the heatmap
map_center = [universities_df['Latitude'].mean(), universities_df['Longitude'].mean()]
m = folium.Map(location=map_center, zoom_start=5)

# Add the heatmap layer
heat_data = [[row['Latitude'], row['Longitude'], row['Average Score']] for index, row in universities_df.iterrows()]
HeatMap(heat_data).add_to(m)

# Create a MarkerCluster object
marker_cluster = MarkerCluster().add_to(m)

# Add markers to the cluster instead of the map
for index, row in universities_df.iterrows():
    popup_content = folium.Popup(f'<div style="width:150px;"><strong>{row["University"]}</strong><br>Overall Score: {row["Average Score"]:.2f}</div>', max_width=265)
    folium.Marker(
        [row['Latitude'], row['Longitude']],
        popup=popup_content
    ).add_to(marker_cluster)

# Save to HTML
m.save('Law_heatmap.html')

print("Heatmap with intensity and clustered markers created and saved.")